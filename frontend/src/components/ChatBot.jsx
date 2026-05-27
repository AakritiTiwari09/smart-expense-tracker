import { useState } from "react";

import {
  GoogleGenerativeAI
} from "@google/generative-ai";

const genAI =
  new GoogleGenerativeAI(
    "AIzaSyD8ASc21vpQmsGTqoqT6bd3D1H2ilJy0Qs"
  );

function ChatBot({ expenses = [] }) {

  const [open,setOpen] =
    useState(false);

  const [message,setMessage] =
    useState("");

  const [chat,setChat] =
    useState([
      {
        sender:"bot",
        text:
          "Hi 👋 I'm your Expense AI Assistant."
      }
    ]);

  const sendMessage =
    async () => {

      if (!message.trim()) return;

      const userMsg = {
        sender:"user",
        text:message
      };

      setChat(prev => [
        ...prev,
        userMsg
      ]);

      setMessage("");

      try {

        const model =
          genAI.getGenerativeModel({
            model:"gemini-2.5-flash"
          });

        const totalExpense =
          expenses.reduce(
            (sum,e)=>
              sum + Number(e.amount),
            0
          );

        const prompt = `
You are a Smart Expense Tracker AI Assistant.

Rules:
- Reply in maximum 2-4 short lines.
- Keep answers under 50 words.
- Be direct and friendly.
- Use bullet points when helpful.
- Never write long paragraphs.
- Give practical budgeting advice.

User expenses:
${JSON.stringify(expenses)}

Total expense:
${totalExpense}

Question:
${message}
`;

        const result =
          await model.generateContent(
            prompt
          );

        const reply =
  result.response
    .text()
    .slice(0, 200);

        setChat(prev => [
          ...prev,
          {
            sender:"bot",
            text:reply
          }
        ]);

      }

      catch(error){

  console.log(error);

  setChat(prev => [
    ...prev,
    {
      sender:"bot",
      text:
        error.message
    }
  ]);

}

    };

  return (

    <>

      <button
        onClick={() =>
          setOpen(!open)
        }

        style={{
  position:"fixed",
  right:"20px",
  bottom:"20px",
  width:"90px",
  height:"80px",
  borderRadius:"50%",
  border:"none",
  background:"#2563eb",
  color:"white",
  fontSize:"40px",
  cursor:"pointer",
  zIndex:9999
}}
      >
        💬
      </button>

      {
        open && (

          <div
            style={{
              position:"fixed",
              right:"20px",
              bottom:"90px",
              width:"350px",
              height:"450px",
              background:"white",
              borderRadius:"15px",
              padding:"15px",
              boxShadow:
                "0 0 15px rgba(0,0,0,0.3)",
              zIndex:9999
            }}
          >

            <h3>
              Expense AI
            </h3>

            <div
              style={{
                height:"320px",
                overflowY:"auto"
              }}
            >

              {
                chat.map(
                  (msg,index)=>(

                    <div
                      key={index}

                      style={{
                        textAlign:
                          msg.sender==="user"
                          ? "right"
                          : "left",

                        margin:"10px 0"
                      }}
                    >

                      <span
                        style={{
                          display:"inline-block",
                          padding:"8px",
                          borderRadius:"10px",

                          background:
                            msg.sender==="user"
                            ? "#2563eb"
                            : "#eee",

                          color:
                            msg.sender==="user"
                            ? "white"
                            : "black"
                        }}
                      >
                        {msg.text}
                      </span>

                    </div>

                  )
                )
              }

            </div>

            <input
              value={message}

              onChange={(e)=>
                setMessage(
                  e.target.value
                )
              }

              placeholder="Ask anything..."

              style={{
                width:"75%",
                padding:"10px"
              }}
            />

            <button
              onClick={sendMessage}
            >
              Send
            </button>

          </div>

        )
      }

    </>

  );

}

export default ChatBot;