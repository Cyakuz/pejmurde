import Figure from 'react-bootstrap/Figure';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


function Figure1() {
  const navigate = useNavigate();


  const [isExtraSmallScreen, setIsExtraSmallScreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const dergiItems = [
    {
      id: "dergi1",
      imageSrc: "https://i.ibb.co/T1HtcQy/01.jpg",
      height: isExtraSmallScreen ? 82 : 125,
      link: "/dergi/1"
    },
    {
      id: "dergi2",
      imageSrc: "https://i.ibb.co/G9FknHB/01-1.jpg",
      height: isExtraSmallScreen ? 82 : 120,
      link: "/dergi/2"
    },
    {
      id: "dergi3",
      imageSrc: "https://i.ibb.co/PW8vhx5/01-2.jpg",
      height: isExtraSmallScreen ? 82 : 120,
      link: "/dergi/3"
    },
    {
      id: "dergi4",
      imageSrc: "https://i.ibb.co/GPJhTxY/01-3.jpg",
      height: isExtraSmallScreen ? 82 : 120,
      link: "/dergi/4"
    },
    {
      id: "dergi5",
      imageSrc: "https://i.ibb.co/1Td4Kn3/01-4.jpg",
      height: isExtraSmallScreen ? 82 : 120,
      link: "/dergi/5"
    },
    {
      id: "dergi1",
      imageSrc: "https://i.ibb.co/x6RnzxT/01-5.jpg",
      height: isExtraSmallScreen ? 82 : 125,
      link: "/dergi/6"
    },
    {
      id: "dergi2",
      imageSrc: "https://i.ibb.co/QXC55Ph/01-6.jpg",
      height: isExtraSmallScreen ? 82 : 120,
      link: "/dergi/ek1"
    },
    {
      id: "dergi3",
      imageSrc: "https://i.ibb.co/p2yyjqv/Ek-Sayi-Son-1.jpg",
      height: isExtraSmallScreen ? 82 : 120,
      link: "/dergi/ek2"
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsExtraSmallScreen(window.innerWidth < 576);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dergiItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
    <div className="bg">
      {currentItems.map((item) => (
        <div className={item.id} key={item.id}>
          <Figure>
            <Figure.Image
              width={"auto"}
              height={item.height}
              alt="171x180"
              src={item.imageSrc}
              onClick={() => navigate(item.link)}
            />
            <Figure.Caption></Figure.Caption>
          </Figure>
        </div>
      ))}

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <button onClick={() => handlePageChange(1)}>1</button>
        <button onClick={() => handlePageChange(2)}>2</button>
      </div>
      </div>
    </>
  );
}

export default Figure1;
