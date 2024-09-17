import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);

  const getData = useCallback(async () => {
    try {
      const eventsData = await api.loadData();
      setData(eventsData);

      // Si des événements sont présents, on trie par date et on sélectionne le plus récent
      if (eventsData && eventsData.events && eventsData.events.length > 0) {
        const sortedEvents = eventsData.events.sort((a, b) => new Date(b.date) - new Date(a.date));
        setLast(sortedEvents[0]); // Définir 'last' comme le dernier événement
      }
    } catch (err) {
      setError(err);
    }
  }, []);
  
  useEffect(() => {
    if (!data) {
      getData();
    }
  }, [data, getData]);
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        last, // Expose 'last' dans le contexte
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
