'use client'

import { useChat } from 'ai/react'
import React, { useState } from 'react';
import Recorder from 'recorder-js';
import { useWhisper } from '@chengsokdara/use-whisper'

const key:string = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY : ""

 

export default function Chat() {
  const { messages,setInput, input, handleInputChange, handleSubmit } = useChat()
  
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
        <p>Recording: {recording}</p>
        <p>Speaking: {speaking}</p>
        <p>Transcribing: {transcribing}</p>
        <p>Transcribed Text: {transcript.text}</p>
        <div className="fixed bottom-0 w-full max-w-md p-0 mb-36 ">
          <button className="w-full max-w-md p-2 mb-2 border border-gray-300 rounded shadow-xl"  onClick={() => startRecording()}>Start</button>
          <button className="w-full max-w-md p-2 mb-2 border border-gray-300 rounded shadow-xl"  onClick={() => pauseRecording()}>Pause</button>
          <button className="w-full max-w-md p-2 mb-2 border border-gray-300 rounded shadow-xl"  onClick={() => stopRecord()}>Stop</button>
        </div>
      </div>
    </div>
  )
}
