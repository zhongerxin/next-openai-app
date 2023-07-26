'use client'

import { useChat } from 'ai/react'
import React, { useState } from 'react';
import Recorder from 'recorder-js';
import { useWhisper } from '@chengsokdara/use-whisper'

const key:string = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY : ""

class MyRecord extends React.Component {
  handleClick = () => {
    const voiceId = '21m00Tcm4TlvDq8ikWAM';  // 你的 voice id
    const apiKey = process.env.VOICE_KEY; // 你的 api key

    fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey ? apiKey:"",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "text": "你好呀 我是中国人",
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
          "stability": 0.5,
          "similarity_boost": 0.5
        }
      })
    })
    .then(response => response.blob())
    .then(blob => {
      var url = URL.createObjectURL(blob)
      console.log(url)
      var audio = new Audio(url);
        // 播放音频
      audio.play();
    })
    .catch((error) => console.error('Error:', error));
  }

  render() {
    return <button onClick={this.handleClick}>点击我</button>;
  }
}

 

export default function Chat() {
  const { messages,setInput, input, handleInputChange, handleSubmit } = useChat()
  
  const handleSpeech = () => {
    const voiceId = '21m00Tcm4TlvDq8ikWAM';  // 你的 voice id
    const apiKey = '5b310c73429ba3bf40a927c0da02bce6'; // 你的 api key
    const message = messages[messages.length - 1]

    fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "text": `${message.content}`,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
          "stability": 0.5,
          "similarity_boost": 0.5
        }
      })
    })
    .then(response => response.blob())
    .then(blob => {
      var url = URL.createObjectURL(blob)
      console.log(url)
      var audio = new Audio(url);
      // audio.muted = true;
        // 播放音频
      audio.play();
    })
    .catch((error) => console.error('Error:', error));
  }

  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    whisperConfig: {
      language: 'zh',
    },
  })
  React.useEffect(() => {
    setInput(transcript.text ? transcript.text : "");
}, [transcript.text]);
  React.useEffect(() => {
    if (messages.length>0 && (messages[messages.length - 1].role != "user")) {
      handleSpeech()
    }
  }, [messages.length]);
  
  const stopRecord = async () => {
    await stopRecording()
    console.log(transcript.text)
    // setInput(transcript.text ? transcript.text : "没有录音输入")
  };
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.length > 0
        ? messages.map(m => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === 'user' ? 'User: ' : 'AI: '}
              {m.content}
            </div>
          ))
        : null}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
        <button type='submit'  className="fixed bottom-0 w-full max-w-md p-2 mb-24 border border-gray-300 rounded shadow-xl" >submit</button>
      </form>
      <div>
        {/* <p>Recording: {recording}</p>
        <p>Speaking: {speaking}</p>
        <p>Transcribing: {transcribing}</p>
        <p>Transcribed Text: {transcript.text}</p> */}
        <div className="fixed bottom-0 w-full max-w-md p-0 mb-36 ">
          <button className="w-full max-w-md p-2 mb-2 border border-gray-300 rounded shadow-xl"  onClick={() => startRecording()}>Start</button>
          <button className="w-full max-w-md p-2 mb-2 border border-gray-300 rounded shadow-xl"  onClick={() => pauseRecording()}>Pause</button>
          <button className="w-full max-w-md p-2 mb-2 border border-gray-300 rounded shadow-xl"  onClick={() => stopRecord()}>Stop</button>
        </div>
      </div>
      {/* <MyRecord></MyRecord> */}
    </div>
  )
}
