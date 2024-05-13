import React from 'react';
import styled from 'styled-components';

const LargeButtonWithBackgroundImage = styled.button`
  position: relative;
  background-image: url(${props => props.backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 200px;/* Adjust width as needed */
  height: 100px;/* Adjust height as needed */
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.6s ease;
 /* Add any additional styling here */

  &::after {
    content: '';
    position: absolute;
    border-radius: 20px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);/* Semi-transparent black overlay */
    opacity: 0.4;/* Initially hidden */
    transition: opacity 0.3s ease;

  }

  &:hover::after {
    opacity: 0.8;/* Show overlay on hover */
  }

`;

const ButtonText = styled.span`

position: relative;
z-index: 1;
color: white;
font-size: 25px;
`;

const ActionButton = ({ text, onClick, backgroundImage }) => {
  return (
    <div className='my-4 me-4'>
      <LargeButtonWithBackgroundImage onClick={onClick} backgroundImage={backgroundImage}>
        <ButtonText>{text}</ButtonText>
      </LargeButtonWithBackgroundImage>
    </div>
  );
};

export default ActionButton;
