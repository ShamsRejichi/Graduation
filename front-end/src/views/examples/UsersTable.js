import React, { useEffect, useState } from "react";
import Header from "../../components/Headers/Header";
import { sendEvaluationEmail } from "../../network/ApiAxios";
import { Card, CardHeader, Container, Row, Table, Input } from "reactstrap";
import { getAll, updateUser } from "../../network/ApiAxios";

const UsersTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const runAsync = async () => {
      const response = await getAll();
      const { data } = response;
      console.log(data.users);
      if (data.success) {
        setUsers(data.users);
      }
    };
    runAsync();
  }, []);
  
  const handleSend = async (id) => {
    try {
      await sendEvaluationEmail(id);
      console.log('Evaluation email sent successfully');
      
      // Perform any additional actions on success
    } catch (error) {
      console.error('Failed to send evaluation email', error);
      // Perform any additional actions on error
    }
  };
  const handleSaveChanges = async () => {
    const updatedUsers = users.filter((user) => user.updated);
    const promises = updatedUsers.map((user) =>
      updateUser(user._id, { role: user.role, pole: user.pole })
    );

    try {
      await Promise.all(promises);
      console.log("Users updated successfully");
      const response = await getAll();
      const { data } = response;
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRoleChange = (event, email) => {
    const updatedUsers = users.map((user) => {
      if (user.email === email) {
        return { ...user, role: event.target.value, updated: true };
      } else {
        return user;
      }
    });
    setUsers(updatedUsers);
  };

  const handlePoleChange = (event, email) => {
    const updatedUsers = users.map((user) => {
      if (user.email === email) {
        console.log(
          "Updating pole for user:",
          user.email,
          "to value:",
          event.target.value
        );
        return { ...user, pole: event.target.value, updated: true };
      } else {
        return user;
      }
    });
    setUsers(updatedUsers);
  };
  

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Users</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Date</th>
                    <th scope="col">Role</th>
                    <th scope="col">Pole</th>
                    <td>
                    <div className="col text-right">
                      <a
                      
                        href="#pablo"
                        className="btn btn-primary btn-sm"
                        onClick={handleSaveChanges}
                      >
                        Save
                      </a>
                    </div></td>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.email}>
                      <th scope="row">{user.name}</th>
                      <td>
                        {user.email}{" "}
                        
                      </td>
                      <td>{user.date}</td>

                      <td>
                        <Input
                          type="select"
                          name="role"
                          id="role"
                          value={user.role}
                          onChange={(e) => handleRoleChange(e, user.email)}
                        >
                          <option value="admin">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="Salarié">Salarié</option>
                          <option value="ProductOwner">ProductOwner</option>
                          <option value="ProjectDirector">
                            ProjectDirector
                          </option>
                        </Input>
                      </td>
                      <td>
                        <Input
                          type="select"
                          name="pole"
                          id="pole"
                          value={user.pole[0]?.label}
                          onChange={(e) => handlePoleChange(e, user.email)}
                        >
                          <option value="Web">Web</option>
                          <option value="Mobile">Mobile</option>
                          <option value="QA">QA</option>
                          <option value="SM">SM</option>
                          <option value="Po">Po</option>
                          <option value="IT_devops">IT-devops</option>
                        </Input>
                        
                      </td>
                      <td>
                      <button
                            className="btn btn-danger btn-sm"
                            
                          >
                            Delete
                          </button>
                          </td>
                    </tr>
                    
                  ))}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default UsersTable;
