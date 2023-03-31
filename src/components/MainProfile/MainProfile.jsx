import React from 'react'
import styles from "./MainProfile.module.scss";
import font from "../../styles/Font.module.scss";
import { useLocation } from 'react-router-dom';

const MainProfile = () => {
  const { state } = useLocation();
  return (
    <div>
      {state}
    </div>
  )
}

export default MainProfile