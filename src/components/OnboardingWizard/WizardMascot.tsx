
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type WizardMascotProps = {
  step: number;
  isCompleted: boolean;
};

const WizardMascot: React.FC<WizardMascotProps> = ({ step, isCompleted }) => {
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const messages = [
      'Hi there! Let\'s get started! 👋',
      'Tell us about yourself! 🙌',
      'Great! What\'s your team like? 🤔',
      'Interesting choices! 🧩',
      'Almost there! 🎯',
      'Last step! 🎨',
    ];
    
    const completedMessages = [
      'All done! Great job! 🎉',
      'You\'re all set! 🚀',
      'Ready to roll! 💯',
    ];
    
    if (isCompleted) {
      const randomIndex = Math.floor(Math.random() * completedMessages.length);
      setMessage(completedMessages[randomIndex]);
    } else {
      setMessage(messages[step]);
    }
  }, [step, isCompleted]);
  
  return (
    <div className="relative">
      <motion.div 
        className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: isCompleted ? [0, 5, -5, 5, -5, 0] : 0,
        }}
        transition={{ 
          duration: isCompleted ? 0.6 : 0.5, 
          repeat: isCompleted ? 0 : Infinity,
          repeatType: 'reverse',
          repeatDelay: 2
        }}
      >
        <span className="text-lg">
          {isCompleted ? '🎉' : '✨'}
        </span>
      </motion.div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={message}
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          className="absolute top-0 right-full mr-2 bg-white px-3 py-1.5 rounded-lg shadow-md text-xs whitespace-nowrap"
          style={{ transformOrigin: 'top right' }}
        >
          {message}
          <div className="absolute top-3 right-[-6px] w-3 h-3 bg-white transform rotate-45" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WizardMascot;
