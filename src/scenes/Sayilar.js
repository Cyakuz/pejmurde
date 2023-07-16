import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import "turn.js";
import { useNavigate } from 'react-router-dom';

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

const pages = [
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/01.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/02.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/03.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/04.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/05.jpg",
  "https://raw.github.com/blasten/turn.js/master/demos/magazine/pages/06.jpg"
];

const Issue = () => {
  const navigate = useNavigate();
  return (
  <>
  <div className="bg">
  <div class="card">
  <div>
  <Turn options={options} className="magazine">
      {pages.map((page, index) => (
        <div key={index} className="page">
          <img src={page} alt="" />
        </div>
      ))}
    </Turn>
    </div>
  <div class="card__content">
    <time datetime="2021-03-30" class="card__date">Tarih</time>
    <span class="card__title">Pejmürde Dergisi Sayi 1: Açıklamalar</span> 
    <div className="exit-icon">
    <i class="fa-solid fa-arrow-right-from-bracket fa-lg" onClick={() => navigate('/')}></i>
      </div>
  </div>
  </div>
</div>
  </>
  );
};

export default Issue;

