import MDSpinner from "react-md-spinner";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {Pagination} from 'react-bootstrap';
import './TournamentResults.scss';

export default class TournamentResults extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      sizePerPage: 4,
      searchFilter: null,
      levelFilter: 'all',
      maxPlayers: 2000,
      players: null
    };

  }

  updateTournamentResults() {

    const xhr = new XMLHttpRequest();
    let start = (this.state.page - 1) * this.state.sizePerPage;
    let n = this.state.sizePerPage;
    let search = this.state.searchFilter ? `&search=${this.state.searchFilter}` : '';
    let level = (this.state.levelFilter !== 'all') ? `&level=${this.state.levelFilter}` : '';
    xhr.open('GET', `http://localhost:20000/api/v1/players?start=${start}&n=${n}${search}${level}`, true);

    xhr.addEventListener('load', () => {
      this.setState({players: JSON.parse(xhr.responseText)});
    });

    xhr.addEventListener('error', () => {
      this.setState({error: true});
    });

    xhr.send(null);
  }

  componentDidMount() {
    this.updateTournamentResults();
  }

  handleSearchFilterChange(event) {
    this.setState({searchFilter: event.target.value}, () => {
      this.updateTournamentResults();
    });

  }

  handleLevelFilterChange(event) {
    this.setState({levelFilter: event.target.value}, () => {
      this.updateTournamentResults();
    });
  }

  handlePageChange(event) {
    this.setState({page: event}, () => {
      this.updateTournamentResults();
    });
  }

  render() {

    if (this.state.error) {
      return <div> Error! </div>;
    } else if (this.state.players === null) {
      return <div className="loading-time"><MDSpinner size={100}/></div>;
    } else {
      return (
        <div className="tournament-results">
          <div className="filter-search">
            <input className="form-control filter-search-control" placeholder="Type to search.." type="text" value={this.state.value}
                   onChange={e => this.handleSearchFilterChange(e)}/>
          </div>
          <BootstrapTable data={this.state.players} striped hover>
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
            <Pagination
              prev
              next
              first
              last
              ellipsis
              boundaryLinks
              items={this.state.maxPlayers / this.state.sizePerPage}
              maxButtons={5}
              activePage={this.state.page}
              onSelect={e => this.handlePageChange(e)}/>
          </div>
        </div>
      );
    }
  }
}
