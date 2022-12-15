import React, { useEffect } from "react";
import { useState } from "react";
import "./index.scss";
import "./app.scss";
import LoadingSpinner from "./Loading";

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        size,
      }),
    };

    const getData = async () => {
      try {
        const response = await fetch(
          "https://backend-openai-production.up.railway.app/openai/generateimage",
          options
        );
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();

        setData(actualData);
        setError(null);
        setPrompt("");
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (prompt !== "") {
      console.log("fn called");
      getData();
    } else {
      setLoading(false);
    }

    console.log("i fire oncee");
  }, [prompt]);

  return (
    <>
      <h1>OpenAI Image Generator</h1>
      <div className="container">
        <div className="left">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPrompt(e.target[0].value);
              setSize(e.currentTarget.elements.size.value);
              setLoading(true);
              console.log(e.currentTarget.elements.size.value);
            }}
          >
            <div className="image-desc">
              <label htmlFor="text">
                <h3>Enter Image Description *</h3>
              </label>
              <input
                type="text"
                id="text"
                placeholder="Enter image description"
                autoComplete="off"
                required
              />
            </div>
            <div className="select-size">
              <h3>Select Image Size</h3>
              <div className="radios">
                <input
                  type="radio"
                  id="small"
                  name="size"
                  onChange={(e) => {
                    setSize(e.currentTarget.elements.size.value);
                  }}
                  value="small"
                />
                <label htmlFor="small">Small</label>

                <input type="radio" id="medium" name="size" value="medium" />
                <label htmlFor="medium">
                  Medium <i>(default)</i>
                </label>

                <input type="radio" id="large" name="size" value="large" />
                <label htmlFor="large">Large</label>
              </div>
            </div>

            <button type="submit">Generate</button>
          </form>
          <div className="info">
            <h3>Disclaimer</h3>
            <br />
            <h4>Tip</h4>
            <p>Click generate button again for same image description to get more variations</p>
            <h4>Preventing Harmful Generations</h4>
            <p>
              We’ve limited the ability for DALL·E 2 to generate violent, hate,
              or adult images. By removing the most explicit content from the
              training data, we minimized DALL·E 2’s exposure to these concepts.
              We also used advanced techniques to prevent photorealistic
              generations of real individuals’ faces, including those of public
              figures.
            </p>
            <h4>Curbing Misuse</h4>
            <p>
              Our content policy does not allow users to generate violent,
              adult, or political content, among other categories. We won’t
              generate images if our filters identify text prompts and image
              uploads that may violate our policies. We also have automated and
              human monitoring systems to guard against misuse.
            </p>
          </div>
        </div>
        <div className="right">
          {loading && <div className="loading"><LoadingSpinner /></div>}
          {data == null && !error && !loading && (
            <div className="intro">Image will be shown here </div>
          )}
          {!loading && error &&  (
            <div className="error">{`The image cannot be generated - ${error}`}</div>
          )}
          {data && !loading && <div className="image"> <img src={data.url} alt="image"></img></div>}
        </div>
      </div>
      <footer>
        <p>Enjoy this tool</p>
        <p>created by <a href="https://github.com/subhadip001" target="_blank">subhadip001</a></p>
      </footer>
    </>
  );
};

export default App;
