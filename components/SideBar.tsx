import React from 'react'
import styled from 'styled-components';

function SideBar() {
    return (
        <StyledWrapper>
            <div className="card fixed top-[8.5rem] left-3 z-40">
                <div><button>Men Shop</button></div>
                <div><button>Women Shop</button></div>
                <div><button>Kids Shop</button></div>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .card {
    width: 210px;
    height: calc(100vh - 9rem);
    border-radius: 10px;
    background: transparent;
    display: flex;
    flex-direction: column;
    padding: 0.4em;
    box-shadow: 0 25px 40px rgba(33,33,33,0.25);
    overflow: hidden;
  }

  .card div {
    flex: 1;
    overflow: hidden;
    cursor: pointer;
    border-radius: 8px;
    transition: flex 0.5s;
    background: #f0edcc;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    margin-bottom: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card div:last-child {
    margin-bottom: 0;
  }

  .card div:hover {
    flex: 4;
  }

  .card div button {
    padding: 0.2em;
    text-align: center;
    transform: rotate(-0deg);
    transition: transform 0.5s;
    text-transform: uppercase;
    color: #00000;
    font-weight: 700;
    // letter-spacing: 0.1em;
    position: relative;
    z-index: 1;
  }

  .card div:hover button {
    transform: rotate(0);
  }

  .card div::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    z-index: 0;
    transition: opacity 0.5s;
    pointer-events: none;
    opacity: 0;
  }

  .card div:hover::before {
    opacity: 1;
  }`;


export default SideBar