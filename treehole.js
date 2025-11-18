document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendButton');
  const chat = document.getElementById('chatMessages');
  const typing = document.getElementById('typingIndicator');

  input.addEventListener('input', () => {
    sendBtn.disabled = input.value.trim().length === 0;
    autoResize(input);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'right');
    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;

    showTyping();

    setTimeout(() => {
      const reply = generateReply(text);
      hideTyping();
      addMessage(reply, 'left');

      setTimeout(() => {
        const followUp = generateFollowUp(reply);
        if (followUp) {
          showTyping();
          setTimeout(() => {
            hideTyping();
            addMessage(followUp, 'left');
          }, Math.random() * 2000 + 1000);
        }
      }, 1200);
    }, Math.random() * 2000 + 1000);
  }

  function addMessage(text, side = 'left') {
    const bubble = document.createElement('div');
    bubble.className = `bubble bubble-${side}`;
    bubble.innerHTML = `
      ${escapeHtml(text)}
      <div class="message-time">${getCurrentTime()}</div>
    `;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
  }

  function showTyping() {
    typing.classList.remove('hidden');
    chat.scrollTop = chat.scrollHeight;
  }

  function hideTyping() {
    typing.classList.add('hidden');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  }

  const replyMap = [
    { keywords: ['anxious', 'worried', 'panic'], reply: "It’s okay to feel anxious. Want to talk about what’s making you feel this way?" },
    { keywords: ['sad', 'depressed', 'down'], reply: "I'm here to listen. What’s been going on lately?" },
    { keywords: ['stress', 'overwhelmed', 'pressure'], reply: "Take a deep breath. We can take this one step at a time. Want to share more?" },
    { keywords: ['comp1100', 'course', 'study', 'assignment', 'exam'], reply: "Sounds like you’re talking about uni. Want help understanding COMP1100 or balancing study stress?" },
    { keywords: ['bad', 'empty', 'lost', 'lonely', 'tired'], reply: "That sounds tough. You don’t have to go through it alone — want to tell me more?" },
    { keywords: ['angry', 'upset', 'frustrated'], reply: "Anger can be heavy to carry. What happened that made you feel this way?" },
    { keywords: ['friend', 'relationship', 'alone'], reply: "Relationships can be complicated. Do you want to share what’s been going on?" },
    { keywords: ['thank', 'thanks'], reply: "You're welcome — I’m here anytime you need to talk." },
    { keywords: ['bye', 'goodbye', 'see you'], reply: "Take care of yourself — remember, you can always come back here when you need to talk 💜" },
    { keywords: ['help', 'support'], reply: "Of course. What kind of support do you feel you need right now?" },
    { keywords: ['feel'], reply: "It’s good that you can express that. How long have you been feeling this way?" }
  ];

  function generateReply(userText) {
    const lower = userText.toLowerCase();
    for (const entry of replyMap) {
      if (entry.keywords.some(keyword => lower.includes(keyword))) {
        return entry.reply;
      }
    }
    return "Thanks for opening up. I'm listening — tell me more.";
  }

  function generateFollowUp(reply) {
    if (reply.includes("tell me more")) {
      return "Take your time — I’m here to listen.";
    }
    if (reply.includes("okay to feel anxious")) {
      return "These feelings are valid, even when they’re hard to face.";
    }
    if (reply.includes("listen")) {
      return "Sometimes talking helps us untangle what we’re feeling.";
    }
    if (reply.includes("study")) {
      return "Balancing uni and life can be tough — have you been resting enough?";
    }
    if (reply.includes("alone")) {
      return "Even when it feels that way, you’re not truly alone.";
    }
    if (reply.includes("take care")) {
      return "";
    }
    return "";
  }
});