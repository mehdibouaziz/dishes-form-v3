import React, { useState } from "react";
import DishesForm from "./DishesForm";

const DishesPage = () => {
  const [APIresponse, setAPIresponse] = useState({
    display: false,
    success: true,
    message: "",
  });

  const clearAPIresponse = () => {
    setAPIresponse({
      display: false,
      success: true,
      message: "",
    });
  };

  const postData = async (data) => {
    // avoid modifying the store
    let POSTdata = { ...data };

    // clean irrelevant data and convert to strings:
    switch (POSTdata.type) {
      case "pizza":
        if (POSTdata.no_of_slices) {
          POSTdata.no_of_slices = +POSTdata.no_of_slices;
        }
        if (POSTdata.diameter) {
          POSTdata.diameter = +POSTdata.diameter;
        }
        if (POSTdata.spiciness_scale) {
          delete POSTdata.spiciness_scale;
        }
        if (POSTdata.slices_of_bread) {
          delete POSTdata.slices_of_bread;
        }
        break;
      case "soup":
        if (POSTdata.spiciness_scale) {
          POSTdata.spiciness_scale = +POSTdata.spiciness_scale;
        }
        if (POSTdata.no_of_slices) {
          delete POSTdata.no_of_slices;
        }
        if (POSTdata.diameter) {
          delete POSTdata.diameter;
        }
        if (POSTdata.slices_of_bread) {
          delete POSTdata.slices_of_bread;
        }
        break;
      case "sandwich":
        if (POSTdata.slices_of_bread) {
          POSTdata.slices_of_bread = +POSTdata.slices_of_bread;
        }
        if (POSTdata.no_of_slices) {
          delete POSTdata.no_of_slices;
        }
        if (POSTdata.diameter) {
          delete POSTdata.diameter;
        }
        if (POSTdata.spiciness_scale) {
          delete POSTdata.spiciness_scale;
        }
        break;
      default:
        break;
    }

    // send POST
    const response = await fetch(
      "https://frosty-wood-6558.getsandbox.com:443/dishes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(POSTdata),
      }
    );

    if (response.status >= 200 && response.status <= 299) {
      //separate true 200 success from 4xx/5xx errors
      const jsonResponse = await response.json();
      console.log("Success:", jsonResponse);
      setAPIresponse({
        display: true,
        success: true,
        message: "Success! Data sent",
      });
    } else if (response.status >= 400 && response.status <= 599) {
      //correctly logging 4xx and 5xx as errors with reason
      const jsonResponse = await response.json();
      console.error("Error", response.status, ": ", jsonResponse);
      setAPIresponse({
        display: true,
        success: false,
        message:
          "Error" + response.status + ": " + JSON.stringify(jsonResponse),
      });
    } else {
      //general error handler
      console.log(response.status, response.statusText);
      setAPIresponse({
        display: true,
        success: false,
        message: "Error" + response.status + ": " + response.statusText,
      });
    }

    setTimeout(clearAPIresponse, 3000);
  };

  return (
    <div className="flex-col">
      <div className="form_container">
        <h1>Upload a new dish</h1>
        <DishesForm onSubmit={postData} />

        {APIresponse.display && (
          <div className="APIresponses">
            <p data-success={APIresponse.success}>{APIresponse.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DishesPage;
