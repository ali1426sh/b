export default {
    async fetch(request, env) {
        const db = env.DB;
        const url = new URL(request.url);
        const path = url.pathname.slice(1);
        const base_url = url.origin;
        
        if (path === "init") {
            const body = await postReq("setWebhook", {
                "url": `${base_url}/${HOOK}`
            });
            return new Response(JSON.stringify(body), { headers: { "Content-Type": "application/json" } });
        }

        if (path === HOOK) {
            try {
                const tgResponse = await request.json();
                
                if (tgResponse.callback_query) {
                    const callbackQuery = tgResponse.callback_query;
                    const chatId = callbackQuery.from.id;
                    const replytoID = decrypt(callbackQuery.message.reply_markup.inline_keyboard[0][0].callback_data);
                    const targetReply = await db.prepare("SELECT * FROM users WHERE id = ?").bind(replytoID).first();
                    await db.prepare("UPDATE users SET target_user = ? WHERE telegram_user_id = ?").bind(targetReply.telegram_user_id, chatId).run();

                    await postReq("sendMessage", {
                        chat_id: chatId,
                        text: "این پایین بنویس و ارسال کن 👇",
                        reply_parameters: {
                            message_id: callbackQuery.message.message_id,
                            chat_id: chatId
                        }
                    });
                    
                    await postReq("answerCallbackQuery", { callback_query_id: callbackQuery.id });
                }

                if (tgResponse.message) {
                    const message = tgResponse.message;
                    const chatId = message.from.id;
                    
                    if (message.text?.startsWith("/start")) {
                        const startedUser = await db.prepare("SELECT * FROM users WHERE telegram_user_id = ?").bind(chatId).first();
                        let startedUserId = startedUser ? startedUser.id : (await db.prepare("INSERT INTO users (telegram_user_id, rkey, target_user) VALUES (?, ?, ?)").bind(chatId, rndKey(), "").run()).meta.last_row_id;
                        
                        const match = message.text.match(/\/start (\w+)_(\w+)/);
                        if (match) {
                            const [_, param_rkey, param_id] = match;
                            const targetUser = await db.prepare("SELECT * FROM users WHERE id = ? AND rkey = ?").bind(revHxId(param_id), param_rkey).first();
                            if (targetUser) {
                                await db.prepare("UPDATE users SET target_user = ? WHERE id = ?").bind(targetUser.telegram_user_id, startedUserId).run();
                                await postReq("sendMessage", {
                                    chat_id: chatId,
                                    text: `در حال ارسال پیام ناشناس به ${targetUser.telegram_user_id} هستی` 
                                });
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("Error handling webhook:", e);
            }
            return new Response("idle");
        }

        return new Response("ok");
    }
};

const BOT_TOKEN = "7974221862:AAFpcASl_TItAg2GyhEfQvWXfw1XoZSqEus";
async function generateHook(token) {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest("MD5", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

const HOOK = await generateHook(BOT_TOKEN);


async function postReq(method, payload) {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return response.json();
}

function rndKey() {
    return Math.random().toString(36).substr(2, 8);
}

function revHxId(hxid) {
    return parseInt(hxid.split("").reverse().join(""), 16);
}

function decrypt(encrypted_data) {
    const key = HOOK;
    const decoded = Buffer.from(encrypted_data, "base64").toString("binary");
    return decoded.split("").map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join("");
}
