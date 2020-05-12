import React from "react";
import { isNullOrUndefined, isUndefined } from "util";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
  SizePerPageDropdownStandalone,
  PaginationTotalStandalone,
} from "react-bootstrap-table2-paginator";
import { Row, Col, Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

import "./style.scss"
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";

const { SearchBar } = Search;

const Table = ({
  data,
  columns,
  defaultSorted = [
    {
      dataField: "id",
      order: "asc",
    },
  ],
  rowClasses,
  headerBtn,
  withAction,
  pagination = true,
  searchBar = true,
  ...props
}) => {
  columns.forEach(column => {
    if ([
      'date',
      'lastUpdated',
      'status'
    ].includes(column.dataField)) {
      column.style = {
        textAlign: 'center'
      }
      column.headerStyle = {
        textAlign: 'center'
      }
    }
  })

  columns[columns.length - 1].style = {
    textAlign: 'right'
  }
  columns[columns.length - 1].headerStyle = {
    textAlign: 'right',
    width: "20%"
  }

  return (
    <ToolkitProvider
      keyField="id"
      data={isNullOrUndefined(data) ? [] : data}
      columns={columns}
      search
    >
      {(props) => (
        <Card className="table-card">
          <PaginationProvider
            pagination={paginationFactory({
              custom: true,
              totalSize: isNullOrUndefined(data)
                ? 0
                : data.length,
            })}
          >
            {({ paginationProps, paginationTableProps }) => (
              <>
                <Card.Header style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <Row>
                    <Col>
                      {searchBar ? (
                        <SearchBar {...props.searchProps} />
                      ) : null}
                    </Col>
                    <div style={{ marginRight: '1em' }}>
                      {isNullOrUndefined(headerBtn) ? null : (
                        headerBtn.map((button, i) => {
                          const handleClick = () => {
                            if (!isNullOrUndefined(button.path)) {
                              return button.history.push(
                                button.path,
                                {
                                  ...button.state,
                                }
                              )
                            } else {
                              button.func()
                            }
                          }

                          return (
                            <span key={i}>
                              <Button
                                variant="outline-info"
                                size="lg"
                                data-tip
                                data-for={isNullOrUndefined(button.tooltip) ? undefined : `header-btn-${i}-${button.tooltip}`}
                                onClick={handleClick}
                                style={{ margin: '0 .5em' }}
                              >
                                {button.value}
                              </Button>
                              {
                                isNullOrUndefined(button.tooltip) ? null : (
                                  <ReactTooltip id={`header-btn-${i}-${button.tooltip}`} effect='solid'>
                                    {button.tooltip}
                                  </ReactTooltip>
                                )
                              }
                            </span>
                          )
                        })
                      )}
                    </div>
                  </Row>
                </Card.Header>
                <Card.Body>
                  {pagination ? (
                    <div className="card-filter">
                      <Row>
                        <Col>
                          <SizePerPageDropdownStandalone
                            {...paginationProps}
                          />
                        </Col>
                        <Col>
                          <PaginationListStandalone {...paginationProps} />
                        </Col>
                      </Row>
                    </div>
                  ) : null}

                  <div className="wrapper">
                    <div className="table-container scrollable-children">
                      <BootstrapTable
                        {...props.baseProps}
                        {...paginationTableProps}
                        bootstrap4
                        bordered={false}
                        noDataIndication={
                          isUndefined(data) ? (
                            <FontAwesomeIcon
                              icon={faSpinner}
                              size="lg"
                              spin
                              style={{ opacity: 0.5 }}
                            />
                          ) : "No data found"
                        }
                        defaultSorted={defaultSorted}
                        hover={
                          isNullOrUndefined(withAction) ? false : isNullOrUndefined(data) ? false : data.length > 0
                        }
                        selectRow={isNullOrUndefined(withAction) ? undefined : {
                          mode: "radio",
                          clickToSelect: true,
                          hideSelectColumn: true,
                          style: { backgroundColor: "#f3f3f3" },
                        }}
                        rowEvents={isNullOrUndefined(withAction) ? undefined : {
                          onClick: (e, row, rowIndex) => {
                            if (typeof withAction === 'object') {
                              const getString = () => {
                                if (isNullOrUndefined(withAction.propToPass)) return '#'

                                if (Array.isArray(withAction.propToPass)) return `?${withAction.propToPass.map(prop => `${prop}=${row[prop]}${withAction.propToPass.length > 1 ? `&` : ``}`)}`
                                else return `/${row[withAction.propToPass]}`
                              }

                              return withAction.history.push(
                                `/${withAction.path}${getString()}`,
                                {
                                  ...withAction.state,
                                  data: row
                                }
                              )
                            } else if (typeof withAction === 'function') {
                              withAction(row)
                            }
                          }
                        }}
                        rowClasses={`${rowClasses}${isNullOrUndefined(withAction) ? null : " actionable"}`}
                      />
                    </div>
                  </div>

                </Card.Body>

                {isNullOrUndefined(data) ||
                  data.length === 0 ? null : (
                    <Card.Footer>
                      <div className="pagination-total-container">
                        <PaginationTotalStandalone {...paginationProps} />
                      </div>
                    </Card.Footer>
                  )}
              </>
            )}
          </PaginationProvider>
        </Card>
      )}
    </ToolkitProvider>
  )
}

export default Table