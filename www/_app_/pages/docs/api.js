import React from "react";
import Layout from "@theme/Layout";
import { RedocStandalone } from "redoc";
import '../../css/redoc.override.css';


function About() {
  return (
    <Layout title={"Core API"} description="Flagbase Core Swagger Docs.">
      <RedocStandalone
        specUrl="/swagger.yaml"
        options={{
          theme: {
            colors: { primary: { main: "#24292E" } },
            typography: {
              fontSize: "1em",
              lineHeight: "1.5em",
              fontWeightRegular: "400",
              fontWeightBold: "600",
              fontWeightLight: "300",
              fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,BlinkMacSystemFont,\"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\"",
            },
            sidebar: {
              width: "260px",
              backgroundColor: "#fafafa",
              textColor: "#000000",
              groupItems: {
                textTransform: "capitalize",
              },
            },
          },
        }}
      />
    </Layout>
  );
}

export default About;
