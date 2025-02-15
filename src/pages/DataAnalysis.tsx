
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StarField from '../components/StarField';
import MouseGlow from '../components/MouseGlow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const DataAnalysis = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ type: 'user' | 'assistant'; content: string }>>([]);
  const { toast } = useToast();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast({
        title: "File uploaded",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });
    }
  };

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat history
    setChatHistory(prev => [...prev, { type: 'user', content: message }]);
    setMessage('');

    // TODO: Implement actual chat functionality
    // For now, just show a placeholder response
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        type: 'assistant', 
        content: "I'll analyze this data for you. What specific insights would you like to explore?" 
      }]);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-white/90">
      <StarField />
      <MouseGlow />
      
      <motion.div 
        className="container mx-auto px-4 py-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants}
          className="flex flex-col gap-8"
        >
          {/* File Upload Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/5 p-6 rounded-lg backdrop-blur-sm"
          >
            <h2 className="text-2xl font-instrument-serif italic mb-4">Upload Your Data</h2>
            <Input
              type="file"
              accept=".csv,.xlsx,.json"
              onChange={handleFileUpload}
              className="bg-white/10 border-white/20"
            />
            {file && (
              <p className="mt-2 text-sm text-white/60">
                File loaded: {file.name}
              </p>
            )}
          </motion.div>

          {/* Chat Interface */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/5 p-6 rounded-lg backdrop-blur-sm"
          >
            <h2 className="text-2xl font-instrument-serif italic mb-4">Chat with Your Data</h2>
            
            {/* Chat History */}
            <div className="mb-4 space-y-4 max-h-[400px] overflow-y-auto">
              {chatHistory.map((msg, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg ${
                    msg.type === 'user' 
                      ? 'bg-white/10 ml-auto max-w-[80%]' 
                      : 'bg-white/5 mr-auto max-w-[80%]'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSubmitMessage} className="flex gap-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about your data..."
                className="bg-white/10 border-white/20 resize-none"
                rows={1}
              />
              <Button type="submit" className="bg-white/10 hover:bg-white/20">
                Send
              </Button>
            </form>
          </motion.div>

          {/* Results Section - To be implemented */}
          <motion.div 
            variants={itemVariants}
            className="bg-white/5 p-6 rounded-lg backdrop-blur-sm"
          >
            <h2 className="text-2xl font-instrument-serif italic mb-4">Analysis Results</h2>
            <p className="text-white/60">Upload data and start chatting to see analysis results.</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DataAnalysis;
