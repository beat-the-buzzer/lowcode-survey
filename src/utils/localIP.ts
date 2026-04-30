export const getIP = (callback: any) => {
  const recode: any = {};
  const RTCPeerConnection: any =
    window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection;
  // if (RTCPeerConnection) {
  //   const win: any = iframe.contentWindow;
  //   RTCPeerConnection =
  //     win.RTCPeerConnection ||
  //     win.mozRTCPeerConnection ||
  //     win.webkitRTCPeerConnection;
  // }
  const pc = new RTCPeerConnection();

  function handleCandidate(candidate: any) {
    console.log(candidate);
    const ip_regexp =
      /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
    // /([0-9]{1,3}(\.[0-9]{1,3}){3}|([a-f0-9]{1,4}((:[a-f0-9]{1,4}){7}|:+[a-f0-9]{1,4}){6}))/;

    console.log(candidate.match(ip_regexp));
    const ip_isMatch = candidate.match(ip_regexp)[1];
    if (!recode[ip_isMatch]) {
      callback(ip_isMatch);
      recode[ip_isMatch] = true;
    }
  }

  pc.onicecandidate = (ice: any) => {
    if (ice.candidate) {
      handleCandidate(ice.candidate.candidate);
    }
  };

  pc.createDataChannel("");
  pc.createOffer(
    (res: any) => {
      pc.setLocalDescription(res);
    },
    () => {}
  );

  setTimeout(() => {
    const lines = pc.localDescription.sdp.split("\n");
    lines.forEach((item: any) => {
      if (item.indexOf("a=candidate:") === 0) {
        handleCandidate(item);
      }
    });
  }, 1000);
};
