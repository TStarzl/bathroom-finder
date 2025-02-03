import React from 'react';

type BathroomCardProps = {
  name: string;
  description: string;
}

export function BathroomCard({ name, description }: BathroomCardProps) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
}