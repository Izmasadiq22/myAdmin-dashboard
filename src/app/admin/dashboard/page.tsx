
"use client";

import { client } from "@/sanity/lib/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import React from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import Swal from "sweetalert2";


interface Order {
  orderDate: string | number | Date;
  _id: string;
  firstName: string;
  lastName: string;
  country: string;
  streetAddress: string;
  city: string;
  province: string;
  zipCode: string;
  phoneNumber: number;
  emailAddress: string;
  total: number;
  discount: number;
  status: string | null;
  cartItems: {
    title: string;
    productImage: string;
  }[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    client
      .fetch(
        `*[_type == "order"]{
            _id,
            firstName,
            lastName,
            country,
            streetAddress,
            city,
            province,
            zipCode,
            phoneNumber,
            emailAddress,
            total,
            discount,
            status,
            orderDate,
            cartItems[] ->{
              title,
              productImage
            }
        }`
      )
      .then((data) => setOrders(data))
      .catch((error) => {
        console.error("Error fetching products", error);
      });
  }, []);

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085de",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;
    try {
      await client.delete(orderId);
      setOrders((prevOrder) =>
        prevOrder.filter((order) => order._id !== orderId)
      );
      Swal.fire("Deleted!", "Your order has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting order", error);
      Swal.fire("Error", "Failed to delete order.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prevOrder) =>
        prevOrder.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      Swal.fire("Success", "Order status updated.", "success");
    } catch (error) {
      console.error("Error updating order status", error);
      Swal.fire("Error", "Failed to change status.", "error");
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-slate-800 text-white p-6 shadow-lg flex justify-between">
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <div className="flex space-x-4">
            {["All", "pending", "dispatch", "success"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-full transition-all ${
                  filter === status
                    ? "bg-white text-black font-bold shadow-md"
                    : "text-white hover:bg-red-700"
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </nav>

        {/* Orders Table */}
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Order Management</h2>
          <div className="bg-white shadow-lg rounded-lg">
            <table className="w-full table-auto text-sm lg:text-base">
              <thead className="bg-slate-700 text-white">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr
                        className="hover:bg-red-50 transition-all"
                        onClick={() => toggleOrderDetails(order._id)}
                      >
                        <td className="py-4 px-4">{order._id}</td>
                        <td className="py-4 px-4">
                          {order.firstName} {order.lastName}
                        </td>
                        <td className="py-4 px-4">{order.streetAddress}</td>
                        <td className="py-4 px-4">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">${order.total}</td>
                        <td className="py-4 px-4">
                          <select
                            value={order.status || ""}
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            className="bg-gray-100 p-1 rounded"
                          >
                            <option value="pending">Pending</option>
                            <option value="dispatch">Dispatch</option>
                            <option value="success">Completed</option>
                          </select>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(order._id);
                            }}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                      {selectedOrderId === order._id && (
                        <tr>
                          <td
                            colSpan={7}
                            className="bg-gray-50 p-4 transition-all"
                          >
                            <h3 className="font-bold text-red-600">
                              Order Details
                            </h3>
                            <p>
                              <strong>Phone:</strong> {order.phoneNumber}
                            </p>
                            <p>
                              <strong>Email:</strong> {order.emailAddress}
                            </p>
                            <p>
                              <strong>City:</strong> {order.city}
                            </p>
                            <ul className="mt-3">
                              {order.cartItems?.map((item, index) => (
                                <li
                                  key={`${order._id}-${index}`}
                                  className="flex items-center gap-4 bg-gray-100 p-2 rounded-md mt-1"
                                >
                                  <span className="font-medium">{item.title}</span>
                                  {item.productImage && (
                                    <Image
                                      src={urlFor(item.productImage).url()}
                                      width={40}
                                      height={40}
                                      alt={item.title}
                                      className="rounded-full"
                                    />
                                  )}
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}