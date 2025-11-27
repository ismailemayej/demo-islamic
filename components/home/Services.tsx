"use client";
import { motion } from "framer-motion";
import { Heading } from "../Heading";
import Background from "../background";
import { useState } from "react";
import { OpenModal } from "../Modal";
import Loader from "../loader";
import { ServiceItem, TServiceSection } from "@/types/all-types";

type ServiceSectionProps = {
  section: TServiceSection | undefined;
};

export const ServiceSection: React.FC<ServiceSectionProps> = ({ section }) => {
  // const { section, loading } = useGetSection("servicesection");

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    null
  );
  const [openModal, setOpenModal] = useState(false);

  const SERVICES: ServiceItem[] = section?.data || [];

  const openDetailsModal = (service: ServiceItem) => {
    setSelectedService(service);
    setOpenModal(true);
  };

  return (
    <Background id="services">
      <Heading
        title={section?.heading?.title || "Our Services"}
        subTitle={section?.heading?.subTitle || "What I Provide"}
      />

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {SERVICES?.slice(0, 8)
          ?.reverse()
          ?.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="
              bg-white dark:bg-gray-800 
              rounded-3xl shadow-lg p-6 
              hover:shadow-2xl transition-all duration-300 
              flex flex-col items-center text-left cursor-pointer
            "
            >
              {/* ICON */}
              <div className="text-5xl text-emerald-600 dark:text-emerald-400 mb-4">
                <i className={`fas ${service.icon}`}></i>
              </div>

              {/* TITLE (Click → Modal) */}
              <h3
                className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-emerald-600 transition"
                onClick={() => openDetailsModal(service)}
              >
                {service.title}
              </h3>

              {/* DESCRIPTION */}
              <p
                className="text-gray-600 dark:text-gray-300 text-sm"
                dangerouslySetInnerHTML={{
                  __html:
                    service.shortDescription ||
                    "I am a passionate <strong>Islamic scholar</strong> dedicated to spreading the message of Islam with wisdom and understanding.",
                }}
              ></p>
            </motion.div>
          ))}
      </div>

      {/* Modal for details */}
      {selectedService && (
        <OpenModal
          title={selectedService.title}
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          size="md"
        >
          <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
            <div className="text-[90px] text-center text-emerald-600 dark:text-emerald-400">
              <i className={`fas ${selectedService.icon}`}></i>
            </div>

            <p className="text-gray-700 dark:text-gray-300">
              {selectedService.shortDescription}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {selectedService.fullDescription}
            </p>
          </div>
        </OpenModal>
      )}
    </Background>
  );
};
