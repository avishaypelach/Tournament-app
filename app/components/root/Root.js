import TournamentResults from '../tournamentResults/TournamentResults';
import './Root.scss'
import React from 'react';


export default class Root extends React.Component {

  constructor() {
    super();

  }

  render() {

    return (
      <div className="root">
        <div className="app-title"><h1>Tournament 101 - Final Results</h1></div>
        <TournamentResults/>
      </div>
    );
  }
}


