import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import ModalAddNew from "./ModalAddNew";
import _, { debounce } from "lodash";
import { fetchAllUser } from "../services/UserService";

import ReactPaginate from "react-paginate";
import ModalEditUser from "./ModalEditUser";
import ModalConfirm from "./ModalConfirm";
import { CSVLink, CSVDownload } from "react-csv";
import Papa from "papaparse";
import "./TableUser.scss";
import { toast } from "react-toastify";

const TableUsers = () => {
  const [listUsers, setListUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
  const [isShowModalEdit, setIsShowModalEdit] = useState(false);
  const [dataUserEdit, setDataUserEdit] = useState({});
  const [dataUserDelete, setDataUserDelete] = useState({});
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [sortBy, setSortBy] = useState("asc");
  const [sortField, setSortField] = useState("id");

  const [keyWords, setKeyWords] = useState("");
  const [dataExport, setDataExport] = useState([]);

  useEffect(() => {
    //call APIs
    getUsers(1);
  }, []);

  const getUsers = async (page) => {
    let res = await fetchAllUser(page);
    if (res && res.data) {
      setListUsers(res.data);
      setTotalUsers(res.total);
      setTotalPages(res.total_pages);
    }
  };

  const handlePageClick = (e) => {
    getUsers(+e.selected + 1);
  };

  const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
  };

  const handleUpdateTable = (user) => {
    setListUsers([user, ...listUsers]);
  };
  const handleEditUser = (user) => {
    setDataUserEdit(user);
    setIsShowModalEdit(true);
  };

  const handleEditUserFromModal = (user) => {
    let cloneListUser = _.cloneDeep(listUsers);
    let index = listUsers.findIndex((item) => item.id === user.id);

    cloneListUser[index].first_name = user.first_name;
    setListUsers(cloneListUser);
  };

  const handleDeleteUser = (user) => {
    setIsShowModalDelete(true);
    setDataUserDelete(user);
  };

  const handleDeleteUserFromModal = (user) => {
    let cloneListUser = _.cloneDeep(listUsers);

    cloneListUser = cloneListUser.filter((item) => item.id !== user.id);
    setListUsers(cloneListUser);
  };

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);

    let cloneListUser = _.cloneDeep(listUsers);
    cloneListUser = _.orderBy(cloneListUser, [sortField], [sortBy]);
    setListUsers(cloneListUser);
  };

  const handleSearch = debounce((e) => {
    let term = e.target.value;
    if (term) {
      let cloneListUser = _.cloneDeep(listUsers);
      cloneListUser = cloneListUser.filter((item) => item.email.includes(term));
      setListUsers(cloneListUser);
    } else {
      getUsers(1);
    }
  }, 2000);

  const getUsersExport = (event, done) => {
    let result = [];
    if (listUsers && listUsers.length > 0) {
      result.push(["Id", "Email", "First Name", "Last Name"]);
      listUsers.map((item, index) => {
        let arr = [];
        arr[0] = item.id;
        arr[1] = item.email;
        arr[2] = item.first_name;
        arr[3] = item.last_name;
        result.push(arr);
      });
      setDataExport(result);
      done();
    }
  };

  const handleImportCSV = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
      if (file.type !== "text/csv") {
        toast.error("Only Accept CSV...");
        return;
      }
      Papa.parse(file, {
        // header: true,
        complete: function (results) {
          let rawCSV = results.data;
          if (rawCSV.length > 0) {
            if (rawCSV[0] && rawCSV[0].length === 3) {
              if (
                rawCSV[0][0] !== "email" ||
                rawCSV[0][1] !== "first_name" ||
                rawCSV[0][2] !== "last_name"
              ) {
                toast.error("Wrong format CSV file");
              }
            } else {
              let result = [];

              rawCSV.map((item, index) => {
                if (index > 0 && item.length === 3) {
                  let obj = {};
                  obj.email = item[0];
                  obj.firstName = item[1];
                  obj.lastName = item[2];
                  result.push(obj);
                }
              });
              setListUsers(result);
            }
          } else {
            toast.error("Not found data on CSV file");
          }
          console.log(results.data);
        },
      });
    }
  };

  return (
    <div>
      <div className="my-3 add-new d-sm-flex">
        <span className="">
          <b>list Users:</b>
        </span>

        <div className="group-btn mt-sm-0 mt-2">
          <label htmlFor="\" className="btn btn-primary">
            Import
          </label>
          <input
            id="test"
            type="file"
            onChange={(e) => handleImportCSV(e)}
            hidden
          />

          <CSVLink
            data={dataExport}
            filename={"user.csv"}
            className="btn btn-primary"
            onClick={getUsersExport}
            asyncOnClick={true}
          >
            Export
          </CSVLink>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsShowModalAddNew(true)}
        >
          Add New Todo
        </button>
      </div>

      <div className="col-12 col-sm-4 my-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={keyWords}
          onChange={(e) => handleSearch(e)}
        />
      </div>

      <div className="customize-table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <div className="sort-header">
                  <span>ID</span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down"
                      onClick={() => handleSort("desc", "id")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up"
                      onClick={() => handleSort("asc", "id")}
                    ></i>
                  </span>
                </div>
              </th>
              <th>Email </th>
              <th>
                <div className="sort-header">
                  <span>First Name</span>
                  <span>
                    <i
                      className="fa-solid fa-arrow-down"
                      onClick={() => handleSort("desc", "first_name")}
                    ></i>
                    <i
                      className="fa-solid fa-arrow-up"
                      onClick={() => handleSort("asc", "first_name")}
                    ></i>
                  </span>
                </div>
              </th>
              <th>Last Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listUsers &&
              listUsers.length > 0 &&
              listUsers.map((item, index) => {
                return (
                  <tr key={`users-${index}`}>
                    <td>{item.id}</td>
                    <td>{item.email}</td>
                    <td>{item.first_name}</td>
                    <td>{item.last_name}</td>
                    <td>
                      <button
                        className="btn btn-warning mx-3"
                        onClick={() => handleEditUser(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />
      <ModalAddNew
        show={isShowModalAddNew}
        handleClose={handleClose}
        handleUpdateTable={handleUpdateTable}
      />
      <ModalEditUser
        show={isShowModalEdit}
        dataUserEdit={dataUserEdit}
        handleClose={handleClose}
        handleEditUserFromModal={handleEditUserFromModal}
      />
      <ModalConfirm
        show={isShowModalDelete}
        handleClose={handleClose}
        dataUserDelete={dataUserDelete}
        handleDeleteUserFromModal={handleDeleteUserFromModal}
      />
    </div>
  );
};

export default TableUsers;
