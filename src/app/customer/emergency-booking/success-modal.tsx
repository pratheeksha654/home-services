"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock3, Home } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SuccessModal({
  open,
  onClose,
}: Props) {
  const router = useRouter();
  return (
    <AnimatePresence>

      {open && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/70
          backdrop-blur-md
          "
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: .8,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: .8,
            }}
            transition={{
              duration: .4,
            }}
            className="
            relative
            w-[90%]
            max-w-lg
            rounded-3xl
            border
            border-[#C8A55E]/20
            bg-[#14161E]
            p-10
            shadow-[0_0_80px_rgba(200,165,94,.2)]
            overflow-hidden
            "
          >

            {/* Glow */}

            <div
              className="
              absolute
              -top-20
              left-1/2
              -translate-x-1/2
              w-72
              h-72
              rounded-full
              bg-[#C8A55E]/10
              blur-[120px]
              "
            />

            {/* Icon */}

            <motion.div
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="
              relative
              z-10
              mx-auto
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-full
              border
              border-[#C8A55E]/20
              bg-[#0D0F14]
              "
            >

              <CheckCircle2
                size={55}
                className="text-[#C8A55E]"
              />

            </motion.div>

            <h2 className="mt-8 text-center text-3xl font-bold text-[#ECEDF0]">
              Emergency Request Submitted
            </h2>

            <p className="mt-5 text-center leading-8 text-[#9CA0AE]">

              Your request has been successfully received.

              <br />

              Our dispatcher has been notified and

              is finding the nearest available technician.

            </p>

            {/* ETA */}

            <div
              className="
              mt-8
              rounded-2xl
              border
              border-[#C8A55E]/20
              bg-[#0D0F14]
              p-5
              "
            >

              <div className="flex items-center gap-3">

                <Clock3 className="text-[#C8A55E]" />

                <div>

                  <p className="font-semibold text-[#ECEDF0]">
                    Estimated Response
                  </p>

                  <span className="text-[#9CA0AE]">
                    10 - 15 Minutes
                  </span>

                </div>

              </div>

            </div>

            <button
              onClick={() => router.push("/customer")}
              className="
              mt-8
              w-full
              rounded-xl
              bg-[#C8A55E]
              py-4
              font-semibold
              text-black
              transition
              hover:scale-[1.02]
              "
            >

              <Home
                size={18}
                className="inline mr-2"
              />

              Back to Home

            </button>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}