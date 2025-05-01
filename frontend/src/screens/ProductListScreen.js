import React, { useEffect } from "react";
import { useState } from "react"; //Added
import axios from "axios"; //Added


import { LinkContainer } from "react-router-bootstrap";
import { Button, Table, Row, Col } from "react-bootstrap";
import { Modal, Form } from "react-bootstrap"; // Added

import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import {
  listProducts,
  deleteProduct,
  createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

function ProductListScreen({ history, match }) {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, pages, page } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

// Added
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    // image: "",
    brand: "",
    qtyInStock: 0,
    category: "",
    description: "",
  });
  

const openModal = () => {
  setShowModal(true);
};

const closeModal = () => {
  setShowModal(false);
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

//----------


  let keyword = history.location.search;
  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo.isAdmin && !userInfo.isVendor) {
      history.push("/login");
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts(keyword));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    keyword,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  // const createProductHandler = () => {
  //   console.log("Hello");
  //   dispatch(createProduct());
  // };


  //----Added
  // const createProductHandler = () => {
  //   dispatch(createProduct(formData));
  //   closeModal(); // Close the modal after creating the product
  // };


  //+++++++
  const createProductHandler = async () => {
    try {
      closeModal(); // Close the modal before making the request
      const response = await axios.post("/api/products/create/", formData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
  
      // Handle the response as needed
      if (response.status === 201) {
        // Product created successfully, you can redirect or display a success message
        console.log("Product created successfully!");
        // Redirect to the product edit page, for example
        history.push(`/admin/product/${response.data._id}/edit`);
      } else {
        // Handle other status codes or errors
        console.error("Product creation failed.");
      }
    } catch (error) {
      // Handle any errors from the POST request
      console.error("Error creating product:", error);
    }
  };
  

  
  //---------

  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          {/* <Button
            className="my-3"
            onClick={createProductHandler}
            style={{ float: "right" }}
          >
            <i className="fas fa-plus"></i> Create product
          </Button> */}
          {/* Added */}
          <Button className="my-3" onClick={openModal} style={{ float: "right" }}>
  <i className="fas fa-plus"></i> Create product
</Button>

          {/* ----- */}
        </Col>
      </Row>

      {/* Added +++++++++*/}
      {/* <Modal show={showModal} onHide={closeModal}>
  <Modal.Header closeButton>
    <Modal.Title>Create Product</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter product name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={closeModal}>
      Close
    </Button>
    <Button variant="primary" onClick={createProductHandler}>
      Create
    </Button>
  </Modal.Footer>
</Modal> */}

<Modal show={showModal} onHide={closeModal}>
  <Modal.Header closeButton>
    <Modal.Title>Create Product</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter product name"
          name="name"
          value={formData.name}
          
          onChange={handleInputChange}
        />
      </Form.Group>
      
      <Form.Group controlId="price">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter product price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          min="0"
        />
      </Form.Group>
      
      {/* <Form.Group controlId="image">
        <Form.Label>Image URL</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter product image URL"
          name="image"
          value={formData.image}
          onChange={handleInputChange}
        />
      </Form.Group> */}
      
      <Form.Group controlId="brand">
        <Form.Label>Brand</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter product brand"
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
        />
      </Form.Group>
      
      <Form.Group controlId="qtyInStock">
        <Form.Label>Quantity in Stock</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter quantity in stock"
          name="qtyInStock"
          value={formData.qtyInStock}
          onChange={handleInputChange}
          min="0"
        />
      </Form.Group>
      
      <Form.Group controlId="category">
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter product category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
        />
      </Form.Group>
      
      <Form.Group controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Enter product description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={closeModal}>
      Close
    </Button>
    <Button variant="primary" onClick={createProductHandler}>
      Create
    </Button>
  </Modal.Footer>
</Modal>


      {/* End Added ++++++++++++ */}

      {loadingDelete && <Loader />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant="danger">{errorCreate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>Rs.{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>

                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate page={page} pages={pages} isAdmin={true} />
        </div>
      )}
    </div>
  );
}

export default ProductListScreen;
