const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');

const app = express();
const PORT = 4000;

// Mock Data (Replace with a database in a real-world scenario)
const products = [
    { id: '1', name: 'Phone', description: 'Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', price: 200.0 },
    { id: '2', name: 'Furniture', description: 'Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', price: 300.0 },
    { id: '3', name: 'Rice', description: 'Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', price: 400.0 },
    { id: '4', name: 'Clothes', description: 'Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua', price: 1500.0 },
];

const orders = [
    { id: '1', productIds: ['1'], customerName: 'John Doe' },
    { id: '2', productIds: ['2'], customerName: 'Jane Doe' },
];

// GraphQL Types
const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLString },
    }),
});

const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        id: { type: GraphQLString },
        productIds: { type: GraphQLList(GraphQLString) },
        customerName: { type: GraphQLString },
    }),
});

// GraphQL Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        products: {
            type: GraphQLList(ProductType),
            resolve: () => products,
        },
        orders: {
            type: GraphQLList(OrderType),
            resolve: () => orders,
        },
    },
});

// GraphQL Root Mutation
const RootMutation = new GraphQLObjectType({
    name: 'RootMutation',
    fields: {
        addProduct: {
            type: ProductType,
            args: {
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                price: { type: GraphQLString },
            },
            resolve: (parent, args) => {
                const newProduct = { id: String(products.length + 1), ...args };
                products.push(newProduct);
                return newProduct;
            },
        },
        addOrder: {
            type: OrderType,
            args: {
                productIds: { type: GraphQLList(GraphQLString) },
                customerName: { type: GraphQLString },
            },
            resolve: (parent, args) => {
                const newOrder = { id: String(orders.length + 1), ...args };
                orders.push(newOrder);
                return newOrder;
            },
        },
    },
});

// GraphQL Schema
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation,
});

// GraphQL Endpoint
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
});

