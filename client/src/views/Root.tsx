import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "../templates/Header";
import Home from "./Home";
import Search from "./Search";
import Container from "@material-ui/core/Container";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { routes } from "../routes";
import Collection from "./Collection";
import theme, { headingGradient } from "../styles/theme";
import Playlists from "./Playlists";
import Login from "./Login";
import Register from "./Register";
import Player from "../templates/Player";
import Message from "../components/Message";
import { PlayerContext, MinimalizeContext } from "../context";
import { connect } from "react-redux";

const useStyles = makeStyles({
  container: {
    padding: 0,
  },
});

export const useCommonStyles = makeStyles({
  introHeading: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "1em",
    borderRadius: "5px",
    padding: "1em",
    backgroundImage: headingGradient,
  },
  subtitle: {
    marginBottom: "1em",
  },
  paragraph: {
    marginBottom: "1em",
  },
  contentHeading: {
    margin: "0.5em 0",
  },
  cardOuter: {
    padding: "1.5em 1.5em 6em 1.5em",
  },
  viewButton: {
    margin: "0.5em 0.5em 1em 0",
    padding: "8px 0",
    minWidth: 0,
    width: "42px",
    "& span": {
      margin: 0,
      padding: 0,
    },
    "& .MuiButton-label": {
      width: "12px",
    },
    "& .MuiTouchRipple-root": {
      display: "none",
    },
  },
  paginationContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "1em",
  },
});

interface RootProps {
  inPlayer: Item | undefined;
  message: {
    message: string;
    error: string;
  };
}

const Root: React.FC<RootProps> = ({ inPlayer, message }) => {
  const classes = useStyles(),
    [playerOn, setPlayerOn] = useState<boolean>(false),
    [playerMinimalized, minimalizePlayer] = useState<boolean>(false);

  const handleMinimalizeContext = (on?: boolean) => {
    const element = document.querySelector("#main-body") as HTMLElement;
    if (!on) {
      minimalizePlayer(false);
      element.classList.add("scroll-lock");
      return;
    }

    minimalizePlayer(true);
    element.classList.remove("scroll-lock");
  };

  const handlePlayerContext = (on?: boolean) => {
    if (!on) {
      setPlayerOn(false);
      return;
    }
    setPlayerOn(true);
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <PlayerContext.Provider value={handlePlayerContext}>
          <MinimalizeContext.Provider
            value={{
              minimalize: handleMinimalizeContext,
              currently: playerMinimalized,
            }}
          >
            <Header />
          </MinimalizeContext.Provider>
        </PlayerContext.Provider>
        <Container className={classes.container}>
          <Switch>
            <Route exact path={routes.home}>
              <Home />
            </Route>
            <Route exact path={routes.search}>
              <Search />
            </Route>
            <Route exact path={routes.collection}>
              <Collection />
            </Route>
            <Route exact path={routes.playlists}>
              <Playlists />
            </Route>
            <Route exact path={routes.login}>
              <Login />
            </Route>
            <Route exact path={routes.register}>
              <Register />
            </Route>
          </Switch>
        </Container>
        {(playerOn || inPlayer) && (
          <Player
            minimalized={playerMinimalized}
            minimalize={minimalizePlayer}
            close={() => setPlayerOn(false)}
          />
        )}
        {(message.message || message.error) && <Message message={message} />}
      </ThemeProvider>
    </Router>
  );
};

const mapStateToProps = (state: StateProps) => {
  const { inPlayer, message } = state;
  return {
    inPlayer,
    message,
  };
};

export default connect(mapStateToProps)(Root);
