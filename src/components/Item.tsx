import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import blankVideo from "../assets/blank-video.jpg";
import {
  makeStyles,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@material-ui/core";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import AddIcon from "@material-ui/icons/Add";
import theme from "../styles/theme";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import CheckIcon from "@material-ui/icons/Check";
import { connect } from "react-redux";
import { addToPlaylist as addToPlaylistAction } from "../actions";

const useStyles = makeStyles({
  videoItem: (props: ItemProps) => {
    return props.type === "playlist" || props.type === "player"
      ? {
          display: "flex",
          alignItems: "top",
          flexDirection: "row",
          padding: "10px",
          "& img": {
            alignSelf: "center",
          },
          "& h6": {
            fontSize: "80%",
            wordBreak: "break-word",
            [theme.breakpoints.up("sm")]: {
              fontSize: "100%",
            },
            [theme.breakpoints.up("lg")]: {
              fontSize: "120%",
            },
          },
        }
      : {
          display: "flex",
          alignItems: "top",
          flexDirection: "column",
          padding: "10px",
          "& img": {
            alignSelf: "center",
          },
          [theme.breakpoints.up("sm")]: {
            flexDirection: "row",
          },
        };
  },
  videoItemGrid: {
    display: "flex",
    alignItems: "top",
    flexDirection: "column",
    padding: "10px",
  },
  videoMiniatureContent: {
    width: "100%",
    padding: "0 !important",
  },

  videoMiniature: {
    display: "flex",
    margin: "0 0 0.4em 0",
    padding: 0,
  },
  videoImageBig: {
    display: "block",
    height: "auto",
    minWidth: "246px",
    alignSelf: "center",
  },
  videoImageSmall: {
    display: "block",
    height: "auto",
    width: "80px",
    alignSelf: "center",
  },
  videoInfo: {
    padding: "0.5em",
    flexDirection: "row",
    "& h6": {
      fontWeight: "bold",
    },
    "& button": {
      margin: "0 0 10px 10px",
    },
    [theme.breakpoints.up("sm")]: {
      padding: " 0 0 0 1em",
    },
  },
  videoButton: {
    margin: "0.5em 0.5em 0.5em 0",
  },
  videoButtonPlaylist: {
    padding: "5px 20px",
    width: "1em",
    minWidth: 0,
    margin: "0 2px 5px 2px",
    "& .MuiButton-startIcon": {
      padding: 0,
      margin: 0,
    },
  },
  dangerButton: {
    backgroundColor: "#f66",
    "&:hover": {
      backgroundColor: "#c55",
    },
  },
  playlistActions: {
    padding: "0 0.25em",
    width: "40px",
    marginLeft: "auto",
    [theme.breakpoints.up("sm")]: {
      alignItems: "center",
      marginLeft: "auto",
      marginRight: "25px",
    },
  },
  caption: {
    display: "block",
    textAlign: "center",
    marginBottom: "0.5em",
    [theme.breakpoints.up("md")]: {
      padding: "0 !important",
      marginLeft: "1em",
      textAlign: (props: ItemProps) => {
        return props.grid ? "center" : "left";
      },
    },
  },
});

interface ItemProps {
  type: string;
  added: Date;
  title: string;
  desc: string;
  grid?: boolean;
  link?: string;
  playlists: Playlist[];
  inCollection?: boolean;
  onAdd?: undefined | ((e: React.MouseEvent<HTMLButtonElement>) => void);
  onRemove?: ((e: React.MouseEvent<HTMLButtonElement>) => void) | (() => void);
  addToPlaylist: (name: string, item: Item) => void;
}

const Item: React.FC<ItemProps> = (props) => {
  const {
    grid,
    type,
    title,
    desc,
    added,
    inCollection,
    playlists,
    link,
    onAdd,
    onRemove,
    addToPlaylist,
  } = props;
  const classes = useStyles(props);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClickPlaylistAdd = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddToPlaylist = (name: string, item: Item) => {
    setAnchorEl(null);
    addToPlaylist(name, item);
  };

  const playlistMenuItems = playlists.map((p: Playlist) => (
    <MenuItem
      onClick={() =>
        handleAddToPlaylist(p.name, {
          id: 0,
          title,
          desc,
          link,
          added: added ? added : new Date(),
        })
      }
    >
      {p.name}
    </MenuItem>
  ));

  return (
    <Grid item xs={12} sm={grid && 6} md={grid && 4} lg={grid && 3}>
      <Card className={classes.videoMiniature}>
        <CardContent className={classes.videoMiniatureContent}>
          <Box
            display="flex"
            className={grid ? classes.videoItemGrid : classes.videoItem}
          >
            <img
              className={
                type !== "playlist" && type !== "player"
                  ? classes.videoImageBig
                  : classes.videoImageSmall
              }
              src={blankVideo}
              alt="Video miniature"
            />
            <Box
              display={(type === "playlist" || type === "player") && "flex"}
              alignItems={
                (type === "playlist" || type === "player") && "center"
              }
              className={classes.videoInfo}
            >
              <Typography variant="h6">
                {title.length > 80 ? `${title.slice(0, 80)}...` : title}
              </Typography>
              {type !== "playlist" && type !== "player" && (
                <Typography variant="body1">
                  {desc.length > 250 ? `${desc.slice(0, 250)}...` : desc}
                </Typography>
              )}

              {type === "collection" && (
                <>
                  <Button
                    className={classes.videoButton}
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<PlayArrowIcon />}
                  >
                    Play
                  </Button>
                  <Button
                    className={classes.videoButton}
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={handleClickPlaylistAdd}
                    startIcon={<PlaylistAddIcon />}
                  >
                    Playlist
                  </Button>
                  <Button
                    className={`${classes.videoButton} ${classes.dangerButton}`}
                    variant="contained"
                    size="small"
                    startIcon={<DeleteForeverIcon />}
                    onClick={onRemove}
                  >
                    Remove
                  </Button>
                </>
              )}
              {type === "search-result" && (
                <>
                  <Button
                    className={classes.videoButton}
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<PlayArrowIcon />}
                  >
                    Play
                  </Button>
                  <Button
                    className={classes.videoButton}
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<PlaylistAddIcon />}
                    onClick={handleClickPlaylistAdd}
                  >
                    Playlist
                  </Button>
                  <Button
                    className={classes.videoButton}
                    variant="contained"
                    color={inCollection ? "default" : "secondary"}
                    size="small"
                    startIcon={inCollection ? <CheckIcon /> : <AddIcon />}
                    disabled={inCollection}
                    onClick={onAdd}
                  >
                    {inCollection ? "In collection" : "Collection"}
                  </Button>
                </>
              )}
            </Box>
            {(type === "playlist" || type === "player") && (
              <Box className={classes.playlistActions}>
                <Button
                  className={classes.videoButtonPlaylist}
                  variant="contained"
                  color="default"
                  size="small"
                  startIcon={<UnfoldMoreIcon />}
                ></Button>
                <Button
                  className={`${classes.videoButtonPlaylist} ${classes.dangerButton}`}
                  variant="contained"
                  size="small"
                  startIcon={<DeleteForeverIcon />}
                  onClick={onRemove}
                ></Button>
              </Box>
            )}
            {(type === "collection" || type === "search-result") && (
              <Menu
                id="playlist-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {playlistMenuItems}
              </Menu>
            )}
          </Box>
          {type !== "playlist" &&
            type !== "player" &&
            type !== "search-result" && (
              <Typography
                className={classes.caption}
                variant="caption"
                component="small"
              >
                <b>Added at:</b>
                {` ${added!.getDate()} ${added!.toLocaleString("en", {
                  month: "long",
                })} ${added!.getFullYear()} `}
                {`- ${added!.getHours()}:${
                  added!.getMinutes() < 9
                    ? `0${added!.getMinutes()}`
                    : added!.getMinutes()
                }`}
              </Typography>
            )}
        </CardContent>
      </Card>
    </Grid>
  );
};

const mapStateToProps = (state: StateProps) => {
  const { playlists } = state;
  return {
    playlists,
  };
};

const mapDispatchToProps = (dispatch: (arg0: any) => any) => ({
  addToPlaylist: (name: string, item: Item) =>
    dispatch(addToPlaylistAction(name, item)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Item);
