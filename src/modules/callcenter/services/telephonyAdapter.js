/**
 * TelephonyAdapter Interface
 * Prepares the backend for future telephony integrations (Twilio, Asterisk, FreePBX, etc.)
 */
class TelephonyAdapter {
  constructor(providerName) {
    this.providerName = providerName;
  }

  /**
   * Initialize connection to the telephony provider
   */
  async connect() {
    throw new Error('connect() must be implemented by subclass');
  }

  /**
   * Make an outgoing call
   * @param {string} from - Operator extension or number
   * @param {string} to - Customer phone number
   * @returns {Promise<Object>} - Call details { call_sid, status }
   */
  async makeCall(from, to) {
    throw new Error('makeCall() must be implemented by subclass');
  }

  /**
   * End an active call
   * @param {string} callSid - The provider's unique call ID
   */
  async endCall(callSid) {
    throw new Error('endCall() must be implemented by subclass');
  }

  /**
   * Fetch call recording URL
   * @param {string} callSid 
   * @returns {Promise<string>} - Recording URL
   */
  async getRecordingUrl(callSid) {
    throw new Error('getRecordingUrl() must be implemented by subclass');
  }
}

module.exports = TelephonyAdapter;
