import { useEffect, useState } from "react";
import { StyledModal, StyledButton } from "./Modal.styles";
import InteractiveHTML from "./reader/InteractiveHTML";
import { TranslatableText } from "./reader/TranslatableText";
import { parse } from "query-string";

export function Modal({ title, content, modalIsOpen, setModalIsOpen, api }) {
  const handleClose = () => {
    location.reload();
    setModalIsOpen(false);
  };

  function mapTags(content, articleInfo, api) {
    const div = document.createElement("div");
    div.innerHTML = content;
    let arrOfInteractive = [];
    var allTags = div.getElementsByTagName("*");
    for (var i = 0, len = allTags.length; i < len; i++) {
      const content = allTags[i].textContent;
      let it = new InteractiveHTML(content, articleInfo, api, allTags[i].nodeName);
      arrOfInteractive.push(it);
    }
    return arrOfInteractive;
  }

  const [interactiveText, setInteractiveText] = useState();
  const [interactiveTitle, setInteractiveTitle] = useState();
  const [translating, setTranslating] = useState(true);
  const [pronouncing, setPronouncing] = useState(false);
  const [contentArray, setContentArray] = useState();

  useEffect(() => {
    let articleInfo = {
      url: "http://test.it/articleurl",
      content: "This is content",
      id: "11833417",
      title: title,
      language: "da",
      starred: true,
    };

    let arrInteractive = mapTags(content, articleInfo, api);
    setInteractiveText(arrInteractive);
    let itTitle = new InteractiveHTML(title, articleInfo, api);
    setInteractiveTitle(itTitle);
  }, []);
  
  if (interactiveText === undefined) {
    return <p>loading</p>;
  }

  return (
    <div>
      {console.log(interactiveText)}
      <StyledModal
        isOpen={modalIsOpen}
        className="Modal"
        overlayClassName="Overlay"
      >
        <StyledButton onClick={handleClose} id="qtClose">
          X
        </StyledButton>
        <h1>
          <TranslatableText
            interactiveText={interactiveTitle}
            translating={translating}
            pronouncing={pronouncing}
          />
        </h1>
        {interactiveText.map((text) => {
            if ((text.tag === "P") || (text.tag === "H3") || (text.tag === "H2") || (text.tag === "H4") || (text.tag === "H5")){
            const CustomTag = `${text.tag}`;
            return (
              <CustomTag>
                <TranslatableText
                  interactiveText={text}
                  translating={translating}
                  pronouncing={pronouncing}
                />
              </CustomTag>
            )}
            if (text.tag === "UL") {
              const CustomTag = `${text.tag}`
              return (
                <CustomTag id="list">
                  <p>this is the list</p>
                </CustomTag>
              )
            }
            if (text.tag === "LI") {
              const li = `${<TranslatableText interactiveText={text} translating={translating} pronouncing={pronouncing}/>}`
              
            }

        })}
      </StyledModal>
    </div>
  );
}
