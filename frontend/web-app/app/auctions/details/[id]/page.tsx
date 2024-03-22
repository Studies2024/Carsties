import React from "react";

export default function Details({ params }: { params: { id: string } }) {
  return <div>Datails for {params.id}</div>;
}
