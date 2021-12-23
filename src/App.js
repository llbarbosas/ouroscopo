import "./App.css";
import ouroscopoData from "./ouroscopo.json";
import { useState, useEffect } from "react";
import { toPng } from "html-to-image";

const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
const getSignByRock = (rock) =>
  Object.keys(ouroscopoData.signos).find(
    (sign) => ouroscopoData.signos[sign].pedra === rock
  );
const randomIntBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const getRandomWisdom = (sign) =>
  ouroscopoData.conselhos[sign][
    randomIntBetween(0, ouroscopoData.conselhos[sign].length - 1)
  ];
const getRandomQuality = (sign) =>
  ouroscopoData.caracteristicas[sign][
    randomIntBetween(0, ouroscopoData.caracteristicas[sign].length - 1)
  ];
const getRandomLoadingText = (lastText) => {
  const random = randomIntBetween(
    0,
    ouroscopoData.frases_carregamento.length - 1
  );
  const randomText = ouroscopoData.frases_carregamento[random];

  return randomText === lastText ? getRandomLoadingText(lastText) : randomText;
};
const getSignInfo = (sign, info) => ouroscopoData.signos[sign][info];

function Select(props) {
  return (
    <select
      {...props}
      className={
        "w-full bg-holy-purple-softer rounded-sm p-2" + (props.className ?? " ")
      }
    ></select>
  );
}

function SelectRocksPage({
  ascendantRock,
  setAscendantRock,
  signRock,
  setSignRock,
  onSubmitRocks,
}) {
  return (
    <div className="w-full">
      <div className="bg-holy-purple-dark rounded-xl p-6 mb-5">
        <div className="mb-3">
          <label
            htmlFor="select-sign-rock"
            className="block text-holy-purple-softer mb-2"
          >
            Pedra que você recebeu
          </label>
          <Select
            id="select-sign-rock"
            value={signRock}
            onChange={(e) => setSignRock(e.target.value)}
          >
            {ouroscopoData.pedras.map((pedra, i) => (
              <option value={pedra} key={i}>
                {capitalize(pedra)}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label
            htmlFor="select-ascendant-rock"
            className="block text-holy-purple-softer mb-2"
          >
            Pedra que você trocou
          </label>
          <Select
            id="select-ascendant-rock"
            value={ascendantRock}
            onChange={(e) => setAscendantRock(e.target.value)}
          >
            {ouroscopoData.pedras.map((pedra, i) => (
              <option value={pedra} key={i}>
                {capitalize(pedra)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex justify-center">
        <DefaultButton className="py-4 px-7 font-bold" onClick={onSubmitRocks}>
          Gerar previsões
        </DefaultButton>
      </div>
    </div>
  );
}

function Sign({
  description,
  sign,
  signDescription,
  equivalentSign,
  equivalentSignDescription,
  children,
  ...props
}) {
  return (
    <div
      {...props}
      className="bg-holy-purple-dark rounded-xl pt-3 mb-5 relative"
    >
      <span className="mx-5 text-holy-purple-softer">{description}</span>
      <div className="bg-holy-purple-soft rounded-xl p-5 mt-3">
        <div>
          <h3 className="text-2xl font-bold inline">{capitalize(sign)}</h3>
          <span className="line-through ml-2 text-holy-purple-softertext">
            {capitalize(equivalentSign)}
          </span>
        </div>
        <span className="block italic text-sm font-light text-holy-purple-softertext">
          "{capitalize(equivalentSignDescription)}"
        </span>
        <p className="mt-3">{signDescription}</p>
        {children}
      </div>
    </div>
  );
}

function Wisdom({ description, text, children, ...props }) {
  return (
    <div
      {...props}
      className="bg-holy-purple-dark rounded-xl pt-3 p-5 mb-5 relative"
    >
      <span className="text-holy-purple-softer">{description}</span>
      <p className="mt-3 text-lg font-medium">{text}</p>
      {children}
    </div>
  );
}

function DefaultButton({ ...props }) {
  return (
    <button
      {...props}
      className={
        "bg-sky-400 p-5 rounded-xl drop-shadow-xl transition hover:drop-shadow-2xl hover:-translate-y-1 hover:scale-110 ease-in-out duration-300 " +
        (props.className ?? " ")
      }
    />
  );
}

function LoadingPage({ onFinishLoad }) {
  const [loadingText, setLoadingText] = useState(getRandomLoadingText());

  useEffect(() => {
    setTimeout(() => {
      onFinishLoad();
    }, 10000);
  }, [onFinishLoad]);

  useEffect(() => {
    const getCurrentLoadingText = () => loadingText;
    const loadingTextInterval = setInterval(() => {
      setLoadingText(getRandomLoadingText(getCurrentLoadingText()));

      return () => clearInterval(loadingTextInterval);
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-32">
      <span className="animate-show text-center">{loadingText}</span>
    </div>
  );
}

function ShowSignInfoPage({ signRock, ascendantRock }) {
  const sign = getSignByRock(signRock);
  const ascendant = getSignByRock(ascendantRock);
  const [shareActionError, setShareActionError] = useState(false);
  const [randomWisdom, setRandomWisdom] = useState("");
  const [randomQuality, setRandomQuality] = useState("");
  const [currentShareButton, setCurrentShareButton] = useState(null);

  const undoOuroscopo = () => {
    localStorage.clear();
    document.location.reload();
  };

  useEffect(() => {
    setRandomWisdom(getRandomWisdom(ascendant));
    setRandomQuality(getRandomQuality(sign));
  }, [sign, ascendant]);

  useEffect(() => {
    if (shareActionError && currentShareButton) {
      currentShareButton.classList.add("bg-red-700", "animate-bounce");

      setTimeout(() => {
        currentShareButton.classList.remove("bg-red-700", "animate-bounce");
        setShareActionError(false);
      }, 2000);
    }
  }, [shareActionError, currentShareButton]);

  const shareAction = (elementId, buttonId, imageName) => () => {
    const shareNode = document.getElementById(elementId);
    const shareButton = document.getElementById(buttonId);
    setCurrentShareButton(shareButton);

    shareButton.style.opacity = "0";

    setTimeout(
      () =>
        toPng(shareNode)
          .then(async (dataUrl) => {
            const blob = await (await fetch(dataUrl)).blob();
            const filesArray = [
              new File([blob], `${imageName}.png`, {
                type: blob.type,
                lastModified: new Date().getTime(),
              }),
            ];
            navigator.share({
              files: filesArray,
            });
          })
          .catch(() => setShareActionError(true))
          .finally(() => (shareButton.style.opacity = "1")),
      500
    );
  };

  return (
    <div className="">
      <h1 className="text-3xl mt-3 mb-6 text-holy-purple-bright font-medium">
        Seu Ouroscopo
      </h1>
      <Sign
        id="sign-card"
        description="Seu signo"
        sign={sign}
        signDescription={getSignInfo(sign, "descricao")}
        equivalentSign={getSignInfo(sign, "equivalente")}
        equivalentSignDescription={getSignInfo(sign, "equivalente_descricao")}
      >
        <DefaultButton
          id="share-sign-button"
          onClick={shareAction("sign-card", "share-sign-button", "signo")}
          className="absolute -right-3 -bottom-5 p-3"
        >
          <ShareIcon height="18px" width="18px" />
        </DefaultButton>
      </Sign>
      <Sign
        id="ascendant-card"
        description="Seu ascendente"
        sign={ascendant}
        signDescription={getSignInfo(ascendant, "descricao")}
        equivalentSign={getSignInfo(ascendant, "equivalente")}
        equivalentSignDescription={getSignInfo(
          ascendant,
          "equivalente_descricao"
        )}
      >
        <DefaultButton
          id="share-ascendant-button"
          onClick={shareAction(
            "ascendant-card",
            "share-ascendant-button",
            "ascendente"
          )}
          className="absolute -right-3 -bottom-5 p-3"
        >
          <ShareIcon height="18px" width="18px" />
        </DefaultButton>
      </Sign>
      <Wisdom
        id="quality-card"
        description="Característica"
        text={randomQuality}
      >
        <DefaultButton
          id="share-quality-button"
          onClick={shareAction(
            "quality-card",
            "share-quality-button",
            "caracteristica"
          )}
          className="absolute -right-3 -bottom-5 p-3"
        >
          <ShareIcon height="18px" width="18px" />
        </DefaultButton>
      </Wisdom>
      <Wisdom
        id="wisdom-card"
        description="Conselho para 2022"
        text={randomWisdom}
      >
        <DefaultButton
          id="share-wisdom-button"
          onClick={shareAction(
            "wisdom-card",
            "share-wisdom-button",
            "conselho-do-dia"
          )}
          className="absolute -right-3 -bottom-5 p-3"
        >
          <ShareIcon height="18px" width="18px" />
        </DefaultButton>
      </Wisdom>
      <div className="flex justify-center">
        <DefaultButton onClick={undoOuroscopo} className="py-4 px-7 font-bold">
          Refazer Ouroscopo
        </DefaultButton>
      </div>
    </div>
  );
}

function ShareIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#302664"
      {...props}
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
  );
}

function App() {
  const [signRock, setSignRock] = useState(ouroscopoData.pedras[0]);
  const [ascendantRock, setAscendantRock] = useState(ouroscopoData.pedras[0]);
  const [currentPage, setCurrentPage] = useState("selectRocks");

  useEffect(() => {
    const signFromStorage = localStorage.getItem("sign");
    const ascendantFromStorage = localStorage.getItem("ascendant");

    if (signFromStorage !== null && ascendantFromStorage !== null) {
      setSignRock(getSignInfo(signFromStorage, "pedra"));
      setAscendantRock(getSignInfo(ascendantFromStorage, "pedra"));
      setCurrentPage("showSignInfo");
    }
  }, []);

  const onSubmitRocks = () => {
    localStorage.setItem("sign", getSignByRock(signRock));
    localStorage.setItem("ascendant", getSignByRock(ascendantRock));
    setCurrentPage("loading");
  };

  const onFinishLoad = () => setCurrentPage("showSignInfo");

  const pages = {
    selectRocks: (
      <SelectRocksPage
        signRock={signRock}
        setSignRock={setSignRock}
        ascendantRock={ascendantRock}
        setAscendantRock={setAscendantRock}
        onSubmitRocks={onSubmitRocks}
      />
    ),
    showSignInfo: (
      <ShowSignInfoPage signRock={signRock} ascendantRock={ascendantRock} />
    ),
    loading: <LoadingPage onFinishLoad={onFinishLoad} />,
  };

  return (
    <div className="p-5 flex flex-column justify-center">
      {pages[currentPage]}
    </div>
  );
}

export default App;
