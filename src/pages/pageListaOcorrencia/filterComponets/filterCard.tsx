import { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { FilterCard } from "./filterCard.styles";

export function FilterComponent() {
  const auth = useContext(AuthContext);
  const [filter, setFilter] = useState("");
}

<FilterCard>

</FilterCard>
