import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    legend: {
      position: "absolute",
      top: "0em",
      right: "2em",
      "&>li": {
        listStyleType: "none",
        display: "flex",
        alignItems: "center",
        marginBottom: "0.5em",
        "&>div:first-child": {
          position: 'relative',
          width: 22,
          height: 22,
          boxSizing: "border-box",
          border: `3px solid gray`,
          marginRight: "0.5em",
        },
      }
    }
  }),
);


export function getTrialLink(id: string) {
  return `#/trials/${id}/`;
}

export function getArtifactLink(folder: string, version: number) {
  return `#/artifact/${folder}/?artifactVersion=${version}`;
}

export function Legend() {
  const classes = useStyles({});
  return <ul className={classes.legend}>
    <li>
      <div style={{ borderRadius: "50%" }}></div>
      <div>trial</div>
    </li>
    <li>
      <div></div>
      <div>artifact</div>
    </li>
  </ul>
}