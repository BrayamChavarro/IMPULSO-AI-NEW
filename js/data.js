// Tips de IA específicos para cada herramienta
const aiTips = {
    notionAI: "¿Sabías que Notion AI puede generar plantillas completas de reuniones y documentos en segundos?",
    pipedriveAI: "¿Sabías que Pipedrive AI puede predecir qué clientes tienen más probabilidad de comprar esta semana?",
    flikiAI: "¿Sabías que Fliki.ai puede convertir un artículo de blog en un video para redes sociales en menos de 5 minutos?",
    canvaAI: "¿Sabías que Canva Magic Studio puede generar logotipos únicos y redimensionar diseños para 10 plataformas diferentes automáticamente?",
    pictoryAI: "¿Sabías que Pictory puede extraer los mejores momentos de un video de 1 hora y crear clips virales automáticamente?",
    synthesiaAI: "¿Sabías que Synthesia puede crear videos de capacitación con avatares realistas en más de 120 idiomas?",
    merlinAI: "¿Sabías que Merlin.ai puede resumir cualquier página web, video de YouTube o PDF con solo un clic?",
    h2oAI: "¿Sabías que H2O.ai puede analizar años de datos de ventas y predecir la demanda de tus productos para el próximo trimestre?"
};

// Datos principales de las herramientas de IA
const aiData = {
    notionAI: { 
        name: 'Notion AI', 
        url: 'https://www.notion.so/product/ai', 
        title: 'Notion AI: Potenciando la Productividad', 
        description: 'Productividad y gestión del conocimiento.', 
        iconColor: 'text-indigo-400', 
        borderColor: 'border-indigo-600', 
        logo: 'img/66e3d72aa7e91197f74da789_Vector_1_d7b4c2b619.svg', 
        intro: 'Análisis de Notion AI. El gráfico de radar muestra sus fortalezas en facilidad de uso y eficiencia, ideal para una herramienta de productividad general.', 
        functionality: "Notion AI funciona como un asistente integrado que entiende el contexto de tus documentos. Puede generar borradores de texto, resumir reuniones, corregir gramática y estilo, y ayudarte a organizar ideas. Su objetivo es hacer la gestión del conocimiento y la creación de documentos más rápida e inteligente.", 
        valueProps: ['Reduce el tiempo dedicado a redacción y documentación.', 'Centraliza la gestión de proyectos y conocimiento con IA.', 'Mejora la consistencia y calidad de la comunicación interna.'], 
        easeOfUse: "Principiante", 
        pricing: "Desde $8 USD/usuario/mes (fact. anual)", 
        successCase: "Ideal para equipos remotos, agencias creativas y startups que necesitan organizar información y proyectos de forma centralizada y colaborativa.", 
        chartData: { values: [5, 5, 3, 4, 4], bgColor: 'rgba(129, 140, 248, 0.2)', borderColor: 'rgba(129, 140, 248, 1)' }, 
        useCases: { 
            'Operaciones': [
                { title: 'Actas de Reuniones', desc: 'Genera resúmenes automáticos con puntos accionables.' }, 
                { title: 'Creación de Procesos', desc: 'Transforma ideas en Procedimientos Operativos formales.' }
            ], 
            'RRHH': [
                { title: 'Descripciones de Puesto', desc: 'Estandariza la creación de perfiles de trabajo.' }
            ], 
            'Marketing': [
                { title: 'Lluvia de Ideas', desc: 'Desarrolla conceptos y borradores para estrategias de contenido.' }
            ] 
        } 
    },
    pipedriveAI: { 
        name: 'Pipedrive AI', 
        url: 'https://www.pipedrive.com/es/ai', 
        title: 'Pipedrive AI: Optimizando las Ventas', 
        description: 'Ventas y gestión de relaciones con clientes.', 
        iconColor: 'text-teal-400', 
        borderColor: 'border-teal-600', 
        logo: 'img/66f57a0637fe4700cbc94571_Vector_1_70ecbab421.png', 
        intro: 'Análisis de Pipedrive AI. El gráfico resalta su alta especialización en ventas y eficiencia, convirtiéndolo en una potente herramienta de CRM.', 
        functionality: "El Asistente de Ventas con IA de Pipedrive analiza tus datos para identificar patrones. Recomienda las próximas acciones, prioriza los leads con mayor probabilidad de cierre y automatiza el seguimiento para que tu equipo se enfoque en vender, no en tareas administrativas.", 
        valueProps: ['Automatiza tareas repetitivas del ciclo de ventas.', 'Prioriza inteligentemente oportunidades de alto valor.', 'Mejora la toma de decisiones con análisis predictivos.'], 
        easeOfUse: "Intermedio", 
        pricing: "Desde $29 USD/usuario/mes (fact. anual)", 
        successCase: "Perfecto para equipos de ventas en PYMES, empresas de SaaS y consultorías que buscan un proceso comercial estructurado y eficiente.", 
        chartData: { values: [4, 4, 5, 4, 3], bgColor: 'rgba(45, 212, 191, 0.2)', borderColor: 'rgba(45, 212, 191, 1)' }, 
        useCases: { 
            'Ventas': [
                { title: 'Asistente de Ventas', desc: 'Recomienda las próximas acciones prioritarias con cada cliente.' }, 
                { title: 'Priorización de Leads', desc: 'Clasifica clientes potenciales según su probabilidad de conversión.' }
            ], 
            'Comunicación': [
                { title: 'Generador de Correos', desc: 'Crea correos electrónicos de seguimiento personalizados y efectivos.' }
            ] 
        } 
    }
};

// Datos para comparativa detallada
const deepDiveData = {
    'Plan Gratuito': { 
        notionAI: ['Incluido con usos limitados.'], 
        pipedriveAI: ['Prueba gratuita de 14 días.'], 
        flikiAI: ['5 minutos de créditos/mes.'], 
        canvaAI: ['Créditos limitados para Magic.'], 
        pictoryAI: ['3 videos de hasta 10 mins.'], 
        synthesiaAI: ['No, solo demo gratis.'], 
        merlinAI: ['Consultas diarias limitadas.'], 
        h2oAI: ['Versión Open Source disponible.'] 
    },
    'Precios': { 
        notionAI: ['Desde $8/usuario/mes'], 
        pipedriveAI: ['Desde $29/usuario/mes'], 
        flikiAI: ['Desde $21/mes'], 
        canvaAI: ['Desde ~$13/mes (Plan Pro)'], 
        pictoryAI: ['Desde $19/usuario/mes'], 
        synthesiaAI: ['Desde $22/mes'], 
        merlinAI: ['Desde $19/mes'], 
        h2oAI: ['Planes Enterprise a medida.'] 
    },
    'Facilidad de Uso': { 
        notionAI: ['Principiante'], 
        pipedriveAI: ['Intermedio'], 
        flikiAI: ['Principiante'], 
        canvaAI: ['Principiante'], 
        pictoryAI: ['Principiante'], 
        synthesiaAI: ['Intermedio'], 
        merlinAI: ['Principiante'], 
        h2oAI: ['Experto'] 
    },
    'Casos de Éxito': { 
        notionAI: ['Equipos remotos, agencias.'], 
        pipedriveAI: ['PYMES B2B, SaaS.'], 
        flikiAI: ['Creadores de contenido, educadores.'], 
        canvaAI: ['Emprendedores, marketers.'], 
        pictoryAI: ['Podcasters, coaches.'], 
        synthesiaAI: ['Formación corporativa, RRHH.'], 
        merlinAI: ['Profesionales, estudiantes.'], 
        h2oAI: ['Científicos de datos, grandes empresas.'] 
    }
}; 