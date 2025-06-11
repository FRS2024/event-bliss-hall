
-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_id UUID REFERENCES public.venues ON DELETE CASCADE NOT NULL,
  host_id UUID REFERENCES auth.users NOT NULL,
  guest_id UUID REFERENCES auth.users NOT NULL,
  booking_id UUID REFERENCES public.bookings ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on conversation and messages tables
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view conversations they are part of" ON public.conversations 
FOR SELECT USING (auth.uid() = host_id OR auth.uid() = guest_id);

CREATE POLICY "Guests can create conversations" ON public.conversations 
FOR INSERT WITH CHECK (auth.uid() = guest_id);

CREATE POLICY "Users can update conversations they are part of" ON public.conversations 
FOR UPDATE USING (auth.uid() = host_id OR auth.uid() = guest_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations" ON public.messages 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.host_id = auth.uid() OR conversations.guest_id = auth.uid())
  )
);

CREATE POLICY "Users can create messages in their conversations" ON public.messages 
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (conversations.host_id = auth.uid() OR conversations.guest_id = auth.uid())
  )
);

CREATE POLICY "Users can update their own messages" ON public.messages 
FOR UPDATE USING (auth.uid() = sender_id);
