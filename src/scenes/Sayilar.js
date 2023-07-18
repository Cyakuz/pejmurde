import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import "turn.js";
import { useNavigate, useParams } from 'react-router-dom';

import Turn from "./Turn.js";

const options = {
  width: 800,
  height: 600,
  autoCenter: true,
  display: "double",
  acceleration: true,
  elevation: 50,
  gradients: !$.isTouch,
  when: {
    turned: function(e, page) {
      console.log("Current view: ", $(this).turn("view"));
    }
  }
};

const pages_1 = [
"https://i.ibb.co/StDvRJ4/01.jpg",
"https://i.ibb.co/tXMq7j0/02.jpg",
"https://i.ibb.co/zby6ScN/03.jpg",
"https://i.ibb.co/wQz6tbd/04.jpg",
"https://i.ibb.co/Ldw2RDW/05.jpg",
"https://i.ibb.co/n8JnD2g/06.jpg",
"https://i.ibb.co/cCg4BjH/07.jpg",
"https://i.ibb.co/PM97Rjh/08.jpg",
"https://i.ibb.co/1L03CmM/09.jpg",
"https://i.ibb.co/NF1qFD5/10.jpg",
"https://i.ibb.co/YBt98ST/11.jpg",
"https://i.ibb.co/dLwVn2L/12.jpg",
"https://i.ibb.co/BPFKjY8/13.jpg",
"https://i.ibb.co/CPHDzm1/14.jpg",
"https://i.ibb.co/0GNZCZf/15.jpg",
"https://i.ibb.co/LCJjW5x/16.jpg",
"https://i.ibb.co/9GrSLKy/17.jpg",
"https://i.ibb.co/6vjBMkS/18.jpg",
"https://i.ibb.co/yWP4nry/19.jpg",
"https://i.ibb.co/6wnHjZS/20.jpg",
"https://i.ibb.co/bsfRTH5/21.jpg",
"https://i.ibb.co/Nrcb5St/22.jpg",
"https://i.ibb.co/GHYZfpY/23.jpg",
"https://i.ibb.co/n75ykyy/24.jpg",
"https://i.ibb.co/nc4tw7G/25.jpg",
"https://i.ibb.co/JxdjD16/26.jpg",
"https://i.ibb.co/h1CvNxD/27.jpg",
"https://i.ibb.co/0GVRrZk/28.jpg",
"https://i.ibb.co/gybFtrZ/29.jpg",
"https://i.ibb.co/pb40tps/30.png",
"https://i.ibb.co/pKZmNRb/31.png",
"https://i.ibb.co/bRmqgy7/32.png",
"https://i.ibb.co/X5vWZx1/33.png",
"https://i.ibb.co/YkdtqPF/34.jpg",
"https://i.ibb.co/XJC7yWp/35.jpg",
"https://i.ibb.co/pWP0PzX/36.jpg",
"https://i.ibb.co/KNBp0FC/37.jpg",
"https://i.ibb.co/CHpbs4F/38.jpg",
"https://i.ibb.co/bFJH3V0/39.jpg",
"https://i.ibb.co/8xksDp7/40.jpg",
"https://i.ibb.co/4SC68WX/41.jpg",
"https://i.ibb.co/2Mqp4Wb/42.jpg",
"https://i.ibb.co/pXr845X/43.jpg",
"https://i.ibb.co/tKc985D/44.jpg",
"https://i.ibb.co/7KLVVGT/45.jpg",
"https://i.ibb.co/GdNk6Lg/46.jpg",
"https://i.ibb.co/h2pwMNz/47.jpg",
"https://i.ibb.co/z7HvLqn/48.jpg",
"https://i.ibb.co/qyBh31j/49.jpg",
"https://i.ibb.co/jzbSL4d/50.jpg"
];

const pages_2 = [
  "https://i.ibb.co/pRPPJQX/01.jpg",
  "https://i.ibb.co/YLtB830/02.jpg",
  "https://i.ibb.co/0qWNkW5/03.jpg",
  "https://i.ibb.co/cXbh2HF/04.jpg",
  "https://i.ibb.co/n0rMq5J/05.jpg",
  "https://i.ibb.co/17kVJR9/06.jpg",
  "https://i.ibb.co/Cs8LN2M/07.jpg",
  "https://i.ibb.co/6vSNSZb/08.jpg",
  "https://i.ibb.co/k5Y7fNS/09.jpg",
  "https://i.ibb.co/YRjn1rr/10.jpg",
  "https://i.ibb.co/XXyHLHt/11.jpg",
  "https://i.ibb.co/6sqdTbb/12.jpg",
  "https://i.ibb.co/QHNkW8W/13.jpg",
  "https://i.ibb.co/wN8QtSv/14.jpg",
  "https://i.ibb.co/GVwk20H/15.jpg",
  "https://i.ibb.co/xDpCGBq/16.jpg",
  "https://i.ibb.co/j8Ygdh7/17.jpg",
  "https://i.ibb.co/DDtsGsD/18.jpg",
  "https://i.ibb.co/K2pnXN2/19.jpg",
  "https://i.ibb.co/PTy6QBh/20.jpg",
  "https://i.ibb.co/ZHgLdp2/21.jpg",
  "https://i.ibb.co/X741Xjs/22.jpg",
  "https://i.ibb.co/hRtFVrd/23.jpg",
  "https://i.ibb.co/84L3QdC/24.jpg",
  "https://i.ibb.co/RpKcV44/25.jpg",
  "https://i.ibb.co/Hqmqn5k/26.jpg",
  "https://i.ibb.co/s551Z7D/27.jpg",
  "https://i.ibb.co/30mqX9V/28.jpg",
  "https://i.ibb.co/23Hdjp1/29.jpg",
  "https://i.ibb.co/HnV9xJk/30.jpg",
  "https://i.ibb.co/PQrk4Sv/31.jpg",
  "https://i.ibb.co/KDGCbWf/32.jpg",
  "https://i.ibb.co/pPSwXXd/33.jpg",
  "https://i.ibb.co/Y347dzy/34.jpg",
  "https://i.ibb.co/hWK9ZRc/35.jpg",
  "https://i.ibb.co/KjGvNLN/36.jpg",
  "https://i.ibb.co/4pFTS4m/37.jpg",
  "https://i.ibb.co/TgHhr3V/38.jpg",
  "https://i.ibb.co/Cb1nktK/39.jpg",
  "https://i.ibb.co/gdpYknJ/40.jpg",
  "https://i.ibb.co/tXWrRTZ/41.jpg",
  "https://i.ibb.co/9ydYhZ1/42.jpg",
  "https://i.ibb.co/Ssfnp0k/43.jpg",
  "https://i.ibb.co/ScHzdTk/44.jpg",
  "https://i.ibb.co/FgfGFTF/45.jpg",
  "https://i.ibb.co/7gh6xLw/46.jpg",
  "https://i.ibb.co/JmSgCmx/47.jpg",
  "https://i.ibb.co/7JD8RrL/48-arka-kapak.jpg"
];

const Issue = () => {
  const navigate = useNavigate();
  const { sayiid } = useParams();

  let pages = [];
  if (sayiid === '1') {
    pages = pages_1;
  } else if (sayiid === '2') {
    pages = pages_2;
  }

  return (
    <>
      <div className="bg">
        <div className="card">
          <div>
            <Turn options={options} className="magazine">
              {pages.map((page, index) => (
                <div key={index} className="page">
                  <img src={page} alt="" />
                </div>
              ))}
            </Turn>
          </div>
          <div className="card__content">
            <time datetime="2021-03-30" className="card__date">Tarih</time>
            <span className="card__title">Pejmürde Dergisi Sayi {sayiid}: Açıklamalar</span>
            <div className="exit-icon">
              <i className="fa-solid fa-arrow-right-from-bracket fa-lg" onClick={() => navigate('/')}></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Issue;
