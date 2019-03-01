import Axios from "axios";
import XmlParser from "fast-xml-parser";
import unescape from "unescape";

const url = "https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc";

class Http {
  sessionId = null;

  async request(payload) {
    try {
      const response = await Axios.request({
        url,
        method: "post",
        data: payload.toString(),
        headers: {
          "Content-Type": "application/soap+xml",
          sid: this.sessionId
        }
      });

      const stripped = response.data.match(
        /(?:<\?[^?]*\?>[\s]*)?<([^:]*):Envelope([\S\s]*)<\/\1:Envelope>/i
      );
      const parsed = XmlParser.parse(unescape(stripped[0]));
      return parsed["s:Envelope"]["s:Body"];
    } catch (e) {
      console.log("Request error", e);
    }

    return false;
  }

  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  hasSessionId() {
    return !!this.sessionId;
  }
}

export default Http;
