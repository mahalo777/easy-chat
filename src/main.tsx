import React, { useState } from 'react';
import { Input, InputAdornment, TextField } from '@mui/material'


type TextContent = {
  type: 'text';
  text: string;
};

type ImageContentPart = {
  type: 'image_url';
  image_url: {
    url: string; // URL or base64 encoded image data
    detail?: string; // Optional, defaults to 'auto'
  };
};

type ContentPart = TextContent | ImageContentPart;

// 定义消息类型
type Message = {
  role: 'user' | 'assistant' | 'system' | 'tool';
  // ContentParts are only for the 'user' role:
  content: string ; // | ContentPart[]
  // If "name" is included, it will be prepended like this
  // for non-OpenAI models: `{name}: {content}`
  name?: string;
};

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  
  const postData = async (data = {}) => {
    console.log('post')
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer xxxx`,
        // "HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
        // "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return res.json();
  }

  const setHistory = (newMessage: Message) => {
    setMessages(last => [...last, newMessage])
  }

  // 发送消息的函数
  const sendMessage = () => {
    if (input.trim() === '') return;

    // 将用户发送的消息添加到消息历史记录中
    setHistory({ content: input, role: 'user' })
    setInput('');

    const data = {
      "model": "mistralai/mistral-7b-instruct:free",
      "messages": [
        {"role": "user", "content": input },
      ],
    }

    postData(data).then((data) => {
      console.log('res', data.choices); // JSON data parsed by `data.json()` call
      setHistory(data.choices[0]?.message)
    });

    // 在此处添加逻辑以处理发送消息的回复
    // 例如，可以调用后端API或使用OpenAI API获取回复
    // 然后将回复添加到消息历史记录中
  };

  return (
    <div>
      {/* 显示消息历史记录 */}
      <div style={{ height: '600px', overflowY: 'scroll', border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ textAlign: message.role === 'user' ? 'right' : 'left', marginBottom: '5px' }}>
            {message?.content}
          </div>
        ))}
      </div>
      {/* 用户输入框和发送按钮 */}
      <Input
        type={'text'}
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
        }}
        endAdornment={
          <InputAdornment position="end">
            <div onClick={sendMessage}>send</div>
          </InputAdornment>
        }
      />
    </div>
  );
};

export default ChatPage;
