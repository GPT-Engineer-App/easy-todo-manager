import React, { useState, useEffect } from "react";
import { ChakraProvider, Box, VStack, Heading, FormControl, FormLabel, Input, Button, List, ListItem, Text, useToast } from "@chakra-ui/react";
import { FaSignInAlt, FaUserPlus, FaPlus, FaCheck } from "react-icons/fa";

const apiBaseUrl = "https://backengine-zq2g.fly.dev";

const Index = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (token) {
      fetchTodos();
    }
  }, [token]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTodos(data);
      } else {
        throw new Error(data.detail || "Error fetching todos");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBaseUrl}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await response.json();
      if (response.ok) {
        setTodos([...todos, data]);
        setTitle("");
        setContent("");
      } else {
        throw new Error(data.detail || "Error creating todo");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.access_token);
        setIsLoggedIn(true);
        setEmail("");
        setPassword("");
      } else {
        throw new Error(data.detail || "Error logging in");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const signup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBaseUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Success",
          description: "Account created successfully, please log in.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(data.detail || "Error signing up");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <VStack spacing={8}>
          <Heading>Todo App</Heading>

          {!isLoggedIn ? (
            <>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </FormControl>
              <Button leftIcon={<FaSignInAlt />} colorScheme="teal" onClick={login}>
                Login
              </Button>
              <Button leftIcon={<FaUserPlus />} colorScheme="gray" onClick={signup}>
                Signup
              </Button>
            </>
          ) : (
            <>
              <FormControl as="form" onSubmit={addTodo}>
                <FormLabel>Title</FormLabel>
                <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                <FormLabel>Content</FormLabel>
                <Input type="text" value={content} onChange={(e) => setContent(e.target.value)} />
                <Button leftIcon={<FaPlus />} colorScheme="teal" mt={4} type="submit">
                  Add Todo
                </Button>
              </FormControl>
              <List spacing={3}>
                {todos.map((todo, index) => (
                  <ListItem key={index} p={3} boxShadow="md">
                    <Heading size="md">{todo.title}</Heading>
                    <Text>{todo.content}</Text>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </VStack>
      </Box>
    </ChakraProvider>
  );
};

export default Index;
