import React from "react";
import { Divider, Card } from "antd";
import { Link } from "react-router";

export default function QuestionBank() {
  return (
    <div
      className="ms-[265px] me-[20px]"
    >
      <p
        className="text-center solaimanlipi font-bold text-4xl"
        style={{ marginTop: "30px" }}
      >
        প্রশ্নব্যাংক
      </p>
      <Divider />
      <div>
        <p className="solaimanlipi text-2xl font-bold">
          মেডিকেল- প্রশ্ন ব্যাংক
        </p>
        <div
          className="grid lg:grid-cols-10 md:grid-cols-4 sm:grid-cols-6 gap-2"
          style={{ marginTop: "10px" }}
        >
          <div>
            <Link
              to={{
                pathname: "/user/question-bank-details/1234",
                search: "?id=123",
              }}
            >
              <Card
                style={{
                  width: "100%",
                  backgroundColor: "#fef9c2",
                  // height: "200px",
                }}
              >
                <p className="text-center solaimanlipi text-2xl">মেডিকেল</p>
              </Card>
            </Link>
          </div>
          <div>
            <Card
              style={{
                width: "100%",
                backgroundColor: "#fef9c2",
                // height: "200px",
              }}
            >
              <p className="text-center solaimanlipi text-2xl">ডেন্টাল</p>
            </Card>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "30px" }}>
        <p className="solaimanlipi text-2xl font-bold">
          বিশ্ববিদ্যালয় - প্রশ্ন ব্যাংক
        </p>
        <div
          className="grid lg:grid-cols-10 md:grid-cols-4 sm:grid-cols-6 gap-2"
          style={{ marginTop: "10px" }}
        >
          <div>
            <Card
              style={{
                width: "100%",
                backgroundColor: "#ffe2e2",
                // height: "200px",
              }}
            >
              <p className="text-center solaimanlipi text-2xl">মেডিকেল</p>
            </Card>
          </div>
          <div>
            <Card
              style={{
                width: "100%",
                backgroundColor: "#ffe2e2",
                // height: "200px",
              }}
            >
              <p className="text-center solaimanlipi text-2xl">ডেন্টাল</p>
            </Card>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <p className="solaimanlipi text-2xl font-bold">
          ইঞ্জিনিয়ারিং - প্রশ্ন ব্যাংক
        </p>
        <div
          className="grid lg:grid-cols-10 md:grid-cols-4 sm:grid-cols-6 gap-2"
          style={{ marginTop: "10px" }}
        >
          <div>
            <Card
              style={{
                width: "100%",
                backgroundColor: "#d0fae5",
                // height: "200px",
              }}
            >
              <p className="text-center solaimanlipi text-2xl">মেডিকেল</p>
            </Card>
          </div>
          <div>
            <Card
              style={{
                width: "100%",
                backgroundColor: "#d0fae5",
                // height: "200px",
              }}
            >
              <p className="text-center solaimanlipi text-2xl">ডেন্টাল</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
