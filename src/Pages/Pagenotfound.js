import React from "react";
import { Link } from "react-router-dom";
import { Layout } from "../Components/Layout";
import { Typewriter } from "../Components/Typewriter";
import { Arrow } from "../Components/Icons";

export const Pagenotfound = () => (
  <Layout>
    <div className="container nf">
      <div>
        <div className="code">4<span className="serif">0</span>4</div>
        <h2 style={{ fontSize: 26, marginTop: 8 }}><Typewriter text="This page is not found" time={40} /></h2>
        <p className="muted" style={{ margin: "10px auto 26px", maxWidth: 380 }}>The link may be broken or the job was removed. Let’s get you back to the open roles.</p>
        <Link to="/" className="btn btn-primary btn-lg">Browse jobs <Arrow /></Link>
      </div>
    </div>
  </Layout>
);
