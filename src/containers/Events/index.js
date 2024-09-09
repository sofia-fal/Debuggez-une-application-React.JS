import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error, last } = useData(); // Ajout de `last` pour obtenir le dernier événement
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrage pour exclure le dernier événement (last)
  const filteredEvents = (
    // Si aucun type n'est sélectionné, on affiche tous les événements
    (!type
      ? data?.events
      // Sinon, on filtre les événements en fonction du type sélectionné
      : data?.events.filter(event => event.type === type)
    ) || []
  ).filter(event => event.id !== last?.id); // Exclure l'événement le plus récent de la liste des événements

  // Pagination : on ne garde que les événements de la page courante
  const paginatedEvents = filteredEvents.filter((event, index) => {
    const startIndex = (currentPage - 1) * PER_PAGE;
    const endIndex = PER_PAGE * currentPage;
    return index >= startIndex && index < endIndex;
  });

  // Gestion du changement de type de filtre (catégorie d'événement)
  const changeType = (evtType) => {
    setCurrentPage(1); // Remettre à la première page après le changement de type
    setType(evtType);
  };

  // Calcul du nombre de pages pour la pagination
  const pageNumber = Math.ceil(filteredEvents.length / PER_PAGE);

  // Génération de la liste des types d'événements pour le filtre
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "loading" // Affichage du message de chargement
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={changeType}  // Gestion du changement de catégorie
          />
          <div id="events" className="ListContainer">
            {/* Affichage des événements paginés */}
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber)].map((_, n) => (
              // Pagination : génération des liens pour naviguer entre les pages
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;