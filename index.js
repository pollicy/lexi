async function SayHello(params) {
  let [tab] = await chrome.tabs.query({ active: true });

  console.log("tab", tab);

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const pageDoc = document.body;
      console.log("pageDoc", pageDoc);
      alert("hello from Lexi");
    },
  });
}

document.getElementById("myButton").addEventListener("click", SayHello);
