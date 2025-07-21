import { NextResponse } from 'next/server';
import chatbot from '../../../../utils/chatbot';

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;
    
    if (!message) {
      console.error('Missing message in request:', body);
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('Processing chatbot request:', { message, historyLength: conversationHistory?.length || 0 });
    
    const response = await chatbot(message, conversationHistory || []);
    
    if (!response) {
      console.error('Empty response from chatbot function');
      return NextResponse.json(
        { response: "I'm sorry, I couldn't generate a response. Please try again." }
      );
    }
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', message: error.message },
      { status: 500 }
    );
  }
}