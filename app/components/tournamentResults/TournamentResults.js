import './TournamentResults.scss';
import MDSpinner from "react-md-spinner";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {Pager} from 'react-bootstrap';

export default class TournamentResults extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      sizePerPage: 10,
      searchFilter: null,
      levelFilter: 'All',
      maxPlayers: 2000,
      players: [],
      offset: 1
    };
  }

  // <!-- AJAX -->

  updateTournamentResults() {
    const xhr = new XMLHttpRequest();
    let start = (this.state.page - 1) * this.state.sizePerPage;
    let n = this.state.sizePerPage +1;
    let search = this.state.searchFilter ? `&search=${this.state.searchFilter}` : '';
    let level = (this.state.levelFilter !== 'All') ? `&level=${this.state.levelFilter}` : '';
    xhr.open('GET', `http://localhost:20000/api/v1/players?start=${start}&n=${n}${search}${level}`, true);

    xhr.addEventListener('load', () => {
      this.setState({players: JSON.parse(xhr.responseText)});
    });

    xhr.addEventListener('error', () => {
      this.setState({error: true});
    });

    xhr.send(null);
  }

  // <!-- when app is uploading -->

  componentDidMount() {
    this.updateTournamentResults();
    this.handlePaginationClick();
  }

  // <!-- handle search filter -->

  handleSearchFilterChange(event) {
    this.setState({searchFilter: event.target.value, page: 1}, () => {
      this.updateTournamentResults();
    });
  }

  // <!-- handle level filter  -->

  handleLevelFilterChange(event) {
    this.setState({levelFilter: event.target.value, page: 1}, () => {
      this.updateTournamentResults();
    });
  }

  // <!-- pagination -->

  prevPage() {
    this.setState({
      page: this.state.page - this.state.offset
    }, () => {
      this.updateTournamentResults();
    })
  }

  nextPage() {
    this.setState({
      page: this.state.page + this.state.offset
    }, () => {
      this.updateTournamentResults();
    })
  }

  handlePaginationClick(){
    document.addEventListener('keydown', (e) => {
      if(e.keyCode === 37 && this.state.page > 1){
        this.prevPage()
      }
      if(e.keyCode === 39 && this.state.players.length === this.state.sizePerPage + 1){
        this.nextPage()
      }
    })
  }

  isFirstPage() {
    return (this.state.page === 1) ? null :
      <Pager.Item previous href="#" onClick={() => this.prevPage()}>&larr; Previous Page</Pager.Item>
  }

  isTherePlayers() {
    return (this.state.players.length < this.state.sizePerPage + 1) ? null :
      <Pager.Item next href="#" onClick={() => this.nextPage()}>Next
        Page &rarr;</Pager.Item>
  }

  // <!-- app UI -->

  render() {
    if (this.state.error) {
      return <div className="error"> Error! </div>;
    } else if (this.state.players === []) {
      return <div className="loading-time"><MDSpinner size={100}/></div>;
    } else {
      return (
        <div className="tournament-results">
          <div className="filter-search">
            <input className="form-control filter-search-control" placeholder="Type to search.." type="text"
                   value={this.state.value}
                   onChange={e => this.handleSearchFilterChange(e)}/>
          </div>
          <BootstrapTable data={this.state.players.slice(0,10)} striped hover>
            <TableHeaderColumn isKey dataField='id'>ID</TableHeaderColumn>
            <TableHeaderColumn dataField='name' columnClassName='player-name'>Player Name
            </TableHeaderColumn>
            <TableHeaderColumn dataField='level'>
              <div className="filter-level-container">
                <label className="filter-level-label">Level</label>
                <select id="filter-level-control" className="filter-level form-control" value={this.state.value}
                        onChange={e => this.handleLevelFilterChange(e)}>
                  <option>All</option>
                  <option>amateur</option>
                  <option>rookie</option>
                  <option>pro</option>
                </select>
              </div>
            </TableHeaderColumn>
            <TableHeaderColumn dataField='score'>Score</TableHeaderColumn>
          </BootstrapTable>
          <div className="pagination-control">
            <Pager>
              {this.isFirstPage()}
              <div className="table-page-number"><span>page: {this.state.page}</span></div>
              {this.isTherePlayers()}
            </Pager>
          </div>
        </div>
      );
    }
  }
}
