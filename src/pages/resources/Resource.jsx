import React from "react";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import data from "../../../public/data/tai-nguyen.daiHoc.json";
import Menu from "../../components/Menu/Menu";

export default function Resources() {
  return (
    <div>
      <Header />
      <Menu/>
      <Footer />
    </div>
  );
}
