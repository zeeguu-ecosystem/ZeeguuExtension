/*global chrome*/
import { checkReadability } from "./checkReadability";
import { getUserInfo} from "./cookies";
import { useState, useEffect } from "react";
import Zeeguu_API from "../../src/zeeguu-react/src/api/Zeeguu_API";
import { getSourceAsDOM } from "./functions";
import { isProbablyReaderable } from "@mozilla/readability";
import logo from "../images/zeeguu128.png";
import {  HeadingContainer, PopUp, BottomContainer} from "./Popup.styles";
import PopupContent from "./PopupContent";
import { EXTENSION_SOURCE } from "../JSInjection/constants";
import { checkLanguageSupport, setUserInLocalStorage } from "./functions";
import { StyledPrimaryButton } from "../JSInjection/Modal/Buttons.styles";

//for isProbablyReadable options object
const minLength = 120;
const minScore = 20;

const ZEEGUU_ORG = "https://www.zeeguu.org";

export default function Popup({ loggedIn }) {
  let api = new Zeeguu_API("https://api.zeeguu.org");

  const [user, setUser] = useState();
  const [tab, setTab] = useState();
  const [isReadable, setIsReadable] = useState();
  const [languageSupported, setLanguageSupported] = useState();

  useEffect(() => {
    if (loggedIn) {
      getUserInfo(ZEEGUU_ORG, setUser);
    }
  }, [loggedIn]);

  useEffect(() => {
    setUserInLocalStorage(user, api)
  }, [user]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setTab(tabs[0]);
    });
  }, []);

  useEffect(() => {
    if (tab !== undefined && user !== undefined) {
      api.session = user.session;
      api.logReaderActivity(api.OPEN_POPUP, "", tab.url, EXTENSION_SOURCE);

      // Readability check and language check
      const documentFromTab = getSourceAsDOM(tab.url);
      const isProbablyReadable = isProbablyReaderable(
        documentFromTab,
        minLength,
        minScore
      );
      const ownIsProbablyReadable = checkReadability(tab.url);
      if (!isProbablyReadable || !ownIsProbablyReadable) {
        setIsReadable(false);
        setLanguageSupported(false);
      } else {
        setIsReadable(true);
        api.session = user.session;
        if (api.session !== undefined) {
          checkLanguageSupport(api, tab, setLanguageSupported)
        }
      }
    }
  }, [tab, user]);

  const openLogin = () => {
    window.open('https://www.zeeguu.org/login', '_blank');
  };

  if (loggedIn === false) {
    return (
      <PopUp>
        <HeadingContainer>
          <img src={logo} alt="Zeeguu logo" />
        </HeadingContainer>
        <BottomContainer>
          <StyledPrimaryButton
            onClick={openLogin}
            name="toLogin"
            className="toLoginButton">Login            
          </StyledPrimaryButton>
        </BottomContainer>
      </PopUp>
    );
  } else {
    if (user === undefined || isReadable === undefined) {        
      return null } else {
      return (
        <PopUp>
            <PopupContent
              isReadable={isReadable}
              languageSupported={languageSupported}
              user={user}
              tab={tab}
              api={api}
              sessionId={user.session}
            ></PopupContent>
        </PopUp>
      );
    } 
  }
}