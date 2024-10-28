import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Segment,
  Item,
  Dropdown,
  Divider,
  Button,
  Message,
} from "semantic-ui-react";

// import mindImg from '../../images/mind.svg';
import mind from "../../images/images.png";

import {
  CATEGORIES,
  NUM_OF_QUESTIONS,
  DIFFICULTY,
  QUESTIONS_TYPE,
  COUNTDOWN_TIME,
} from "../../constants";
import { shuffle } from "../../utils";

import Offline from "../Offline";

const Main = ({ startQuiz }) => {
  const [category, setCategory] = useState("0");
  const [numOfQuestions, setNumOfQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("easy");
  const [questionsType, setQuestionsType] = useState("0");
  const [countdownTime, setCountdownTime] = useState({
    hours: 0,
    minutes: 120,
    seconds: 0,
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);

  const handleTimeChange = (e, { name, value }) => {
    setCountdownTime({ ...countdownTime, [name]: value });
  };

  let allFieldsSelected = false;
  if (
    category &&
    numOfQuestions &&
    difficulty &&
    questionsType &&
    (countdownTime.hours || countdownTime.minutes || countdownTime.seconds)
  ) {
    allFieldsSelected = true;
  }

  const fetchData = () => {
    setProcessing(true);

    if (error) setError(null);

    const API = `https://opentdb.com/api.php?amount=${numOfQuestions}&category=${category}&difficulty=${difficulty}&type=${questionsType}`;

    fetch(API)
      .then((respone) => respone.json())
      .then((data) =>
        setTimeout(() => {
          const { response_code, results } = data;

          if (response_code === 1) {
            const message = (
              <p>
                The API doesn't have enough questions for your query. (Ex.
                Asking for 50 Questions in a Category that only has 20.)
                <br />
                <br />
                Please change the <strong>No. of Questions</strong>,{" "}
                <strong>Difficulty Level</strong>, or{" "}
                <strong>Type of Questions</strong>.
              </p>
            );

            setProcessing(false);
            setError({ message });

            return;
          }

          results.forEach((element) => {
            element.options = shuffle([
              element.correct_answer,
              ...element.incorrect_answers,
            ]);
          });

          setProcessing(false);
          startQuiz(
            results,
            countdownTime.hours + countdownTime.minutes + countdownTime.seconds
          );
        }, 1000)
      )
      .catch((error) =>
        setTimeout(() => {
          if (!navigator.onLine) {
            setOffline(true);
          } else {
            setProcessing(false);
            setError(error);
          }
        }, 1000)
      );
  };

  if (offline) return <Offline />;

  return (
    <Container>
      <Segment>
        <Item.Group divided>
          <Item>
            {/* <Item.Image src={mindImg}/> */}
            <Item.Image src={mind} />
            <Item.Content>
              <Item.Header>
               
              </Item.Header>
              {error && (
                <Message error onDismiss={() => setError(null)}>
                  <Message.Header>Error!</Message.Header>
                  {error.message}
                </Message>
              )}
              <Divider />
              <Item.Meta>
                <p>In what field do you wish to engage in the quiz?</p>
                <Dropdown
                  search
                  fluid
                  selection
                  name="category"
                  placeholder="Select Quiz Category"
                  header="Select Quiz Category"
                  options={CATEGORIES}
                  value={category}
                  onChange={(e, { value }) => setCategory(value)}
                  disabled={processing}
                />
                <br />
                <p>
                  How numerous inquiries would you like to include in your quiz?
                </p>
                <Dropdown
                  search 
                  fluid
                  selection
                  name="numOfQ"
                  placeholder="Select No. of Questions"
                  header="Select No. of Questions"
                  options={NUM_OF_QUESTIONS}
                  value={numOfQuestions}
                  onChange={(e, { value }) => setNumOfQuestions(value)}
                  disabled={processing}
                />
                <br />
                <p>What level of challenge do you desire for your quiz?</p>
                <Dropdown
                  fluid
                  selection
                  name="difficulty"
                  placeholder="Select Difficulty Level"
                  header="Select Difficulty Level"
                  options={DIFFICULTY}
                  value={difficulty}
                  onChange={(e, { value }) => setDifficulty(value)}
                  disabled={processing}
                />
                <br />
                <p>What category of inquiries do you prefer for your quiz?</p>
                <Dropdown
                  fluid
                  selection
                  name="type"
                  placeholder="Select Questions Type"
                  header="Select Questions Type"
                  options={QUESTIONS_TYPE}
                  value={questionsType}
                  onChange={(e, { value }) => setQuestionsType(value)}
                  disabled={processing}
                />
                <br />
                <p>Please designate the countdown duration for your quiz.</p>
                <div style={{ display: "flex" }}>
                  <div>
                    <p style={{fontSize: "17px"}}>Hours</p>
                    <Dropdown
                      search
                      selection
                      name="hours"
                      placeholder="Select Hours"
                      header="Select Hours"
                      options={COUNTDOWN_TIME.hours}
                      value={countdownTime.hours}
                      onChange={handleTimeChange}
                      disabled={processing}
                    />
                  </div>
                  <div>
                    <p style={{fontSize: "17px"}}>Minutes</p>
                    <Dropdown
                      search
                      selection
                      name="minutes"
                      placeholder="Select Minutes"
                      header="Select Minutes"
                      options={COUNTDOWN_TIME.minutes}
                      value={countdownTime.minutes}
                      onChange={handleTimeChange}
                      disabled={processing}
                    />
                  </div>
                  <div>
                    <p style={{fontSize: "17px"}}>Seconds</p>
                    <Dropdown
                      search
                      selection
                      name="seconds"
                      placeholder="Select Seconds"
                      header="Select Seconds"
                      options={COUNTDOWN_TIME.seconds}
                      value={countdownTime.seconds}
                      onChange={handleTimeChange}
                      disabled={processing}
                    />
                  </div>
                </div>
              </Item.Meta>
              <Divider />
              <Item.Extra>
                <Button
                  primary
                  size="big"
                  icon="play"
                  labelPosition="left"
                  content={processing ? "Processing..." : "Play Now"}
                  onClick={fetchData}
                  disabled={!allFieldsSelected || processing}
                />
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <br />
    </Container>
  );
};

Main.propTypes = {
  startQuiz: PropTypes.func.isRequired,
};

export default Main;
