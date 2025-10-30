import { MOCK_LECTURES } from "@/data";
import { ArrowRight, Calendar, Globe, MapPin } from "lucide-react";
import { Card } from "../cart";

export const UpcomingLectures: React.FC = () => {
  return (
    <section
      id="lectures"
      className="container mx-auto px-0 py-12 px-3 rounded-xl 
             bg-gradient-to-b from-amber-50 to-white 
             dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-900"
    >
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-8 border-b-2 border-green-100 dark:border-green-800 inline-block pb-1">
        Upcoming Lectures
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_LECTURES.map((lecture, index) => (
          <Card
            key={index}
            className="p-5 flex flex-col justify-between transition-shadow hover:shadow-xl bg-white dark:bg-gray-800"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-green-600" />
                Date: {lecture.date}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-bold ${
                  lecture.type === "live"
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200"
                    : "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                }`}
              >
                {lecture.type === "live" ? "সরাসরি" : "অনলাইন"}
              </span>
            </div>

            <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 hover:text-green-700 dark:hover:text-green-400 cursor-pointer transition">
              {lecture.title}
            </h4>

            <div className="text-sm text-gray-500 dark:text-gray-300 mb-4 flex items-start space-x-2">
              {lecture.type === "live" ? (
                <MapPin className="w-4 h-4 mt-1 flex text-gray-500 dark:text-gray-300" />
              ) : (
                <Globe className="w-4 h-4 mt-1 flex text-gray-500 dark:text-gray-300" />
              )}
              <span>{lecture.location}</span>
            </div>

            <a
              href="#"
              className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center hover:underline"
            >
              বিস্তারিত পড়ুন
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </Card>
        ))}
      </div>
    </section>
  );
};
