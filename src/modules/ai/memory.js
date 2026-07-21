class AIMemory {
  // Prunes history to the last 10 messages (5 pairs) and ensures safe context
  pruneHistory(history) {
    if (!history || !Array.isArray(history)) return [];
    
    // Validate history format
    const validHistory = history.filter(msg => 
      msg && typeof msg === 'object' && msg.role && msg.content
    );

    const MAX_MESSAGES = 10;
    
    if (validHistory.length <= MAX_MESSAGES) {
      return validHistory;
    }

    // Keep the most recent MAX_MESSAGES
    return validHistory.slice(-MAX_MESSAGES);
  }

  // Future feature: summarize old history instead of just dropping it
  // async summarizeHistory(history, engine) { ... }
}

module.exports = new AIMemory();
